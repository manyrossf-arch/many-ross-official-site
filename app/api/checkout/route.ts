import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getPrintfulCatalog, hasPrintfulToken, PrintfulApiError } from "@/lib/printful/client";
import {
  convertAmountToMinorUnits,
  getCheckoutSiteUrl,
  getStripeClient,
} from "@/lib/stripe";
import { hasMockLikeId } from "@/lib/store-purchase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LINES = 20;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;
const CART_VERSION = "many-ross-cart-v1";
const CHECKOUT_SOURCE = "many-ross-universo-web";
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

type CheckoutItemInput = {
  variantId: string;
  quantity: number;
};

type CheckoutFailureStep =
  | "validacion del carrito"
  | "PRINTFUL_API_TOKEN"
  | "consulta a Printful"
  | "NEXT_PUBLIC_SITE_URL"
  | "STRIPE_SECRET_KEY"
  | "creacion de Stripe Checkout Session"
  | "cualquier otra excepcion";

class CheckoutHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly step: CheckoutFailureStep,
    message: string,
    public readonly missingEnv?: string,
  ) {
    super(message);
    this.name = "CheckoutHttpError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(record: Record<string, unknown>, allowedKeys: string[]) {
  return Object.keys(record).every((key) => allowedKeys.includes(key));
}

function createPublicMessage(status: number, step: CheckoutFailureStep) {
  if (status >= 500) {
    return "No se pudo preparar el checkout seguro.";
  }

  if (step === "validacion del carrito") {
    return "No se pudo validar el carrito enviado al checkout.";
  }

  return "No se pudo procesar el checkout solicitado.";
}

function buildErrorResponse(error: CheckoutHttpError) {
  if (IS_DEVELOPMENT) {
    return NextResponse.json(
      {
        step: error.step,
        message: error.message,
        missingEnv: error.missingEnv || null,
        status: error.status,
      },
      { status: error.status },
    );
  }

  return NextResponse.json(
    {
      error: {
        status: error.status,
        message: createPublicMessage(error.status, error.step),
      },
    },
    { status: error.status },
  );
}

function normalizeItems(payload: unknown): CheckoutItemInput[] {
  if (!isRecord(payload) || !hasOnlyKeys(payload, ["items"])) {
    throw new CheckoutHttpError(400, "validacion del carrito", "El cuerpo del checkout debe contener solamente la propiedad items.");
  }

  const rawItems = payload.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutHttpError(400, "validacion del carrito", "Debes enviar al menos un producto para crear el checkout.");
  }

  if (rawItems.length > MAX_LINES) {
    throw new CheckoutHttpError(400, "validacion del carrito", `El checkout permite un maximo de ${MAX_LINES} lineas por solicitud.`);
  }

  const grouped = new Map<string, number>();

  for (const rawItem of rawItems) {
    if (!isRecord(rawItem) || !hasOnlyKeys(rawItem, ["variantId", "quantity"])) {
      throw new CheckoutHttpError(400, "validacion del carrito", "Cada item solo puede incluir variantId y quantity.");
    }

    const variantId = typeof rawItem.variantId === "string" ? rawItem.variantId.trim() : "";
    const quantity = typeof rawItem.quantity === "number" ? rawItem.quantity : NaN;

    if (!variantId) {
      throw new CheckoutHttpError(400, "validacion del carrito", "Cada item debe incluir un variantId valido.");
    }

    if (hasMockLikeId(variantId)) {
      throw new CheckoutHttpError(409, "validacion del carrito", `La variante ${variantId} pertenece a un producto demo/mock y no puede procesarse.`);
    }

    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      throw new CheckoutHttpError(400, "validacion del carrito", `La cantidad por item debe estar entre ${MIN_QUANTITY} y ${MAX_QUANTITY}.`);
    }

    const nextQuantity = (grouped.get(variantId) || 0) + quantity;

    if (nextQuantity > MAX_QUANTITY) {
      throw new CheckoutHttpError(400, "validacion del carrito", `La variante ${variantId} supera la cantidad maxima permitida de ${MAX_QUANTITY}.`);
    }

    grouped.set(variantId, nextQuantity);
  }

  return Array.from(grouped.entries()).map(([variantId, quantity]) => ({ variantId, quantity }));
}

function normalizeUnknownError(error: unknown) {
  if (error instanceof CheckoutHttpError) {
    return error;
  }

  if (error instanceof PrintfulApiError) {
    return new CheckoutHttpError(error.status >= 500 ? 502 : error.status, "consulta a Printful", error.message);
  }

  if (error instanceof Stripe.errors.StripeError) {
    return new CheckoutHttpError(502, "creacion de Stripe Checkout Session", error.message);
  }

  const message = error instanceof Error ? error.message : "Se produjo un error inesperado al crear el checkout.";

  if (message.includes("PRINTFUL_API_TOKEN")) {
    return new CheckoutHttpError(503, "PRINTFUL_API_TOKEN", message, "PRINTFUL_API_TOKEN");
  }

  if (message.includes("STRIPE_SECRET_KEY")) {
    return new CheckoutHttpError(503, "STRIPE_SECRET_KEY", message, "STRIPE_SECRET_KEY");
  }

  if (message.includes("NEXT_PUBLIC_SITE_URL")) {
    return new CheckoutHttpError(500, "NEXT_PUBLIC_SITE_URL", message, "NEXT_PUBLIC_SITE_URL");
  }

  return new CheckoutHttpError(500, "cualquier otra excepcion", message);
}

export async function POST(request: Request) {
  try {
    if (!hasPrintfulToken()) {
      throw new CheckoutHttpError(
        503,
        "PRINTFUL_API_TOKEN",
        "Falta la variable privada PRINTFUL_API_TOKEN para consultar el catalogo real.",
        "PRINTFUL_API_TOKEN",
      );
    }

    const validatedItems = normalizeItems(await request.json());
    const products = await getPrintfulCatalog();
    const variants = new Map(
      products.flatMap((product) =>
        product.variants.map((variant) => [
          variant.id,
          {
            product,
            variant,
          },
        ]),
      ),
    );

    const resolvedItems = validatedItems.map((item) => {
      const match = variants.get(item.variantId);

      if (!match) {
        throw new CheckoutHttpError(409, "consulta a Printful", `La variante ${item.variantId} no pertenece al catalogo real sincronizado desde Printful.`);
      }

      const { product, variant } = match;

      if (
        product.availability === "archived" ||
        product.availability === "draft" ||
        variant.price === null ||
        !variant.currency
      ) {
        throw new CheckoutHttpError(409, "consulta a Printful", `La variante ${variant.name} no esta lista para checkout en este momento.`);
      }

      return {
        quantity: item.quantity,
        product,
        variant,
      };
    });

    const currencies = Array.from(new Set(resolvedItems.map((item) => item.variant.currency?.toUpperCase() || "USD")));

    if (currencies.length !== 1) {
      throw new CheckoutHttpError(409, "validacion del carrito", "No se puede crear un checkout con monedas mixtas.");
    }

    const currency = currencies[0];
    const siteUrl = getCheckoutSiteUrl();
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      allow_promotion_codes: true,
      customer_creation: "if_required",
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart?checkout=cancelled`,
      metadata: {
        cartVersion: CART_VERSION,
        source: CHECKOUT_SOURCE,
      },
      line_items: resolvedItems.map(({ product, variant, quantity }) => ({
        quantity,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: convertAmountToMinorUnits(variant.price ?? 0, currency),
          product_data: {
            name: product.name,
            description: variant.name,
            images: variant.imageUrl ? [variant.imageUrl] : undefined,
            metadata: {
              productId: product.id,
              variantId: variant.id,
              source: product.source,
            },
          },
        },
      })),
    });

    if (!session.url) {
      throw new CheckoutHttpError(502, "creacion de Stripe Checkout Session", "Stripe no devolvio una URL valida para el checkout.");
    }

    return NextResponse.json(
      {
        checkoutUrl: session.url,
        sessionId: session.id,
      },
      { status: 200 },
    );
  } catch (error) {
    return buildErrorResponse(normalizeUnknownError(error));
  }
}
