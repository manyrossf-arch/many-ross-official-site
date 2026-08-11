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
  | "validate_cart"
  | "PRINTFUL_API_TOKEN"
  | "fetch_printful_product"
  | "fetch_printful_variant"
  | "validate_price"
  | "NEXT_PUBLIC_SITE_URL"
  | "create_stripe_checkout_session"
  | "unexpected_error";

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

  if (step === "validate_cart") {
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

function sanitizeMessage(message: string) {
  return message
    .replace(/sk_(test|live)_[A-Za-z0-9]+/gi, "[redacted_stripe_key]")
    .replace(/pfk_[A-Za-z0-9_]+/gi, "[redacted_printful_token]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/authorization/gi, "[redacted_header]");
}

function logCheckoutError(error: CheckoutHttpError, originalError?: unknown) {
  const payload: Record<string, unknown> = {
    step: error.step,
    status: error.status,
    errorName:
      originalError instanceof Error
        ? originalError.name
        : error instanceof Error
          ? error.name
          : "UnknownError",
    message: sanitizeMessage(error.message),
  };

  if (originalError instanceof PrintfulApiError) {
    payload.printful = {
      endpoint: error.step === "fetch_printful_variant" ? "/store/products/:id" : "/store/products",
      status: originalError.status,
      message: sanitizeMessage(originalError.message),
    };
  }

  if (originalError instanceof Stripe.errors.StripeError) {
    payload.stripe = {
      type: originalError.type,
      code: originalError.code || null,
      message: sanitizeMessage(originalError.message),
      statusCode: originalError.statusCode || null,
    };
  }

  console.error("[api/checkout]", payload);
}

function normalizeItems(payload: unknown): CheckoutItemInput[] {
  if (!isRecord(payload) || !hasOnlyKeys(payload, ["items"])) {
    throw new CheckoutHttpError(400, "validate_cart", "El cuerpo del checkout debe contener solamente la propiedad items.");
  }

  const rawItems = payload.items;

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new CheckoutHttpError(400, "validate_cart", "Debes enviar al menos un producto para crear el checkout.");
  }

  if (rawItems.length > MAX_LINES) {
    throw new CheckoutHttpError(400, "validate_cart", `El checkout permite un maximo de ${MAX_LINES} lineas por solicitud.`);
  }

  const grouped = new Map<string, number>();

  for (const rawItem of rawItems) {
    if (!isRecord(rawItem) || !hasOnlyKeys(rawItem, ["variantId", "quantity"])) {
      throw new CheckoutHttpError(400, "validate_cart", "Cada item solo puede incluir variantId y quantity.");
    }

    const variantId = typeof rawItem.variantId === "string" ? rawItem.variantId.trim() : "";
    const quantity = typeof rawItem.quantity === "number" ? rawItem.quantity : NaN;

    if (!variantId) {
      throw new CheckoutHttpError(400, "validate_cart", "Cada item debe incluir un variantId valido.");
    }

    if (hasMockLikeId(variantId)) {
      throw new CheckoutHttpError(409, "validate_cart", `La variante ${variantId} pertenece a un producto demo/mock y no puede procesarse.`);
    }

    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      throw new CheckoutHttpError(400, "validate_cart", `La cantidad por item debe estar entre ${MIN_QUANTITY} y ${MAX_QUANTITY}.`);
    }

    const nextQuantity = (grouped.get(variantId) || 0) + quantity;

    if (nextQuantity > MAX_QUANTITY) {
      throw new CheckoutHttpError(400, "validate_cart", `La variante ${variantId} supera la cantidad maxima permitida de ${MAX_QUANTITY}.`);
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
    return new CheckoutHttpError(
      error.status >= 500 ? 502 : error.status,
      error.status === 404 ? "fetch_printful_variant" : "fetch_printful_product",
      error.message,
    );
  }

  if (error instanceof Stripe.errors.StripeError) {
    return new CheckoutHttpError(502, "create_stripe_checkout_session", error.message);
  }

  const message = error instanceof Error ? error.message : "Se produjo un error inesperado al crear el checkout.";

  if (message.includes("PRINTFUL_API_TOKEN")) {
    return new CheckoutHttpError(503, "PRINTFUL_API_TOKEN", message, "PRINTFUL_API_TOKEN");
  }

  if (message.includes("STRIPE_SECRET_KEY")) {
    return new CheckoutHttpError(503, "create_stripe_checkout_session", message, "STRIPE_SECRET_KEY");
  }

  if (message.includes("NEXT_PUBLIC_SITE_URL")) {
    return new CheckoutHttpError(500, "NEXT_PUBLIC_SITE_URL", message, "NEXT_PUBLIC_SITE_URL");
  }

  return new CheckoutHttpError(500, "unexpected_error", message);
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
        throw new CheckoutHttpError(409, "fetch_printful_variant", `La variante ${item.variantId} no pertenece al catalogo real sincronizado desde Printful.`);
      }

      const { product, variant } = match;

      if (
        product.availability === "archived" ||
        product.availability === "draft" ||
        variant.price === null ||
        !variant.currency
      ) {
        throw new CheckoutHttpError(409, "validate_price", `La variante ${variant.name} no esta lista para checkout en este momento.`);
      }

      return {
        quantity: item.quantity,
        product,
        variant,
      };
    });

    const currencies = Array.from(new Set(resolvedItems.map((item) => item.variant.currency?.toUpperCase() || "USD")));

    if (currencies.length !== 1) {
      throw new CheckoutHttpError(409, "validate_cart", "No se puede crear un checkout con monedas mixtas.");
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
      throw new CheckoutHttpError(502, "create_stripe_checkout_session", "Stripe no devolvio una URL valida para el checkout.");
    }

    return NextResponse.json(
      {
        checkoutUrl: session.url,
        sessionId: session.id,
      },
      { status: 200 },
    );
  } catch (error) {
    const normalizedError = normalizeUnknownError(error);
    logCheckoutError(normalizedError, error);
    return buildErrorResponse(normalizedError);
  }
}