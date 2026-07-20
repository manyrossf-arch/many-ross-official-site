import type {
  StoreApiErrorCode,
  StoreProduct,
  StoreProductVariant,
} from "@/types/store";

const PRINTFUL_API_BASE = "https://api.printful.com";
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRIES = 2;

export class PrintfulApiError extends Error {
  constructor(
    public readonly code: StoreApiErrorCode,
    public readonly status: number,
    message: string,
    public readonly retryable: boolean,
  ) {
    super(message);
    this.name = "PrintfulApiError";
  }
}

type PrintfulListItem = {
  id?: number | string;
  external_id?: string | null;
  name?: string | null;
  thumbnail_url?: string | null;
  variants?: number | null;
  synced?: number | null;
  is_ignored?: boolean | null;
};

type PrintfulListResponse = {
  result?: PrintfulListItem[];
};

type UnknownRecord = Record<string, unknown>;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toStringValue(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function toNumberValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toArray(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.filter(Boolean) as UnknownRecord[] : [];
}

function getPrintfulToken(): string | null {
  const token = process.env.PRINTFUL_API_TOKEN?.trim();
  return token && token.length > 0 ? token : null;
}

export function hasPrintfulToken(): boolean {
  return Boolean(getPrintfulToken());
}

function mapError(status: number, fallbackMessage?: string): PrintfulApiError {
  switch (status) {
    case 401:
      return new PrintfulApiError(
        "PRINTFUL_UNAUTHORIZED",
        401,
        fallbackMessage || "Printful rechazo el token privado. Verifica que sea valido y tenga acceso de lectura.",
        false,
      );
    case 403:
      return new PrintfulApiError(
        "PRINTFUL_FORBIDDEN",
        403,
        fallbackMessage || "El token de Printful no tiene permisos suficientes para leer productos.",
        false,
      );
    case 404:
      return new PrintfulApiError(
        "PRINTFUL_NOT_FOUND",
        404,
        fallbackMessage || "Printful no encontro el recurso solicitado para este catalogo.",
        false,
      );
    case 429:
      return new PrintfulApiError(
        "PRINTFUL_RATE_LIMITED",
        429,
        fallbackMessage || "Printful limito temporalmente las solicitudes. Intenta de nuevo en unos momentos.",
        true,
      );
    default:
      return new PrintfulApiError(
        "PRINTFUL_UPSTREAM_ERROR",
        status >= 500 ? status : 502,
        fallbackMessage || "Printful no respondio correctamente. Intenta de nuevo en breve.",
        true,
      );
  }
}

async function parseErrorMessage(response: Response) {
  try {
    const body = await response.json();
    if (body && typeof body === "object") {
      const record = body as UnknownRecord;
      return toStringValue(record.error?.toString()) || toStringValue(record.message) || toStringValue(record.result);
    }
  } catch {
    return null;
  }

  return null;
}

export async function printfulFetch<T>(
  path: string,
  options?: {
    timeoutMs?: number;
    retries?: number;
  },
): Promise<T> {
  const token = getPrintfulToken();

  if (!token) {
    throw new PrintfulApiError(
      "PRINTFUL_UNAUTHORIZED",
      401,
      "Falta la variable privada PRINTFUL_API_TOKEN.",
      false,
    );
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options?.retries ?? DEFAULT_RETRIES;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${PRINTFUL_API_BASE}${path}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        signal: controller.signal,
        next: { revalidate: 120 },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const upstreamMessage = await parseErrorMessage(response);
        const error = mapError(response.status, upstreamMessage || undefined);

        if (error.retryable && attempt < retries) {
          await sleep(400 * (attempt + 1));
          continue;
        }

        throw error;
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof PrintfulApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        if (attempt < retries) {
          await sleep(400 * (attempt + 1));
          continue;
        }

        throw new PrintfulApiError(
          "PRINTFUL_TIMEOUT",
          504,
          "Printful tardo demasiado en responder. Intenta de nuevo en unos momentos.",
          true,
        );
      }

      if (attempt < retries) {
        await sleep(400 * (attempt + 1));
        continue;
      }

      throw new PrintfulApiError(
        "PRINTFUL_NETWORK_ERROR",
        502,
        "No fue posible conectar con Printful desde el servidor.",
        true,
      );
    }
  }

  throw new PrintfulApiError(
    "PRINTFUL_UNKNOWN_ERROR",
    500,
    "Se produjo un error inesperado al consultar Printful.",
    false,
  );
}

function pickVariantImage(record: UnknownRecord): string | null {
  const direct =
    toStringValue(record.image_url) ||
    toStringValue(record.thumbnail_url) ||
    toStringValue(record.preview_url) ||
    toStringValue(record.product_image);

  if (direct) {
    return direct;
  }

  const files = toArray(record.files);
  for (const file of files) {
    const preview = toStringValue(file.preview_url) || toStringValue(file.thumbnail_url) || toStringValue(file.url);
    if (preview) {
      return preview;
    }
  }

  return null;
}

function normalizeVariant(record: UnknownRecord, fallbackImage: string | null): StoreProductVariant {
  const product = (record.product && typeof record.product === "object" ? record.product : null) as UnknownRecord | null;
  const size = toStringValue(record.size) || toStringValue(product?.size);
  const color = toStringValue(record.color) || toStringValue(product?.color);
  const imageUrl = pickVariantImage(record) || fallbackImage;

  return {
    id: toStringValue(record.id) || crypto.randomUUID(),
    name:
      toStringValue(record.name) ||
      toStringValue(product?.name) ||
      [color, size].filter(Boolean).join(" / ") ||
      "Variante sin nombre",
    sku: toStringValue(record.sku),
    size,
    color,
    price: toNumberValue(record.retail_price),
    currency: toStringValue(record.currency) || "USD",
    availability: toStringValue(record.availability_status) || toStringValue(record.availability) || null,
    imageUrl,
  };
}

function normalizeAvailability(syncProduct: UnknownRecord, variants: StoreProductVariant[]): StoreProduct["availability"] {
  const ignored = Boolean(syncProduct.is_ignored);
  if (ignored) {
    return "archived";
  }

  if (variants.some((variant) => variant.availability === "active" || variant.availability === "in_stock")) {
    return "active";
  }

  if (variants.length > 0) {
    return "draft";
  }

  return "unknown";
}

function buildDescription(name: string, variants: StoreProductVariant[]): string {
  const colors = Array.from(new Set(variants.map((variant) => variant.color).filter(Boolean))).slice(0, 2);
  const sizes = Array.from(new Set(variants.map((variant) => variant.size).filter(Boolean))).slice(0, 3);
  const colorCopy = colors.length > 0 ? ` en ${colors.join(" y ")}` : "";
  const sizeCopy = sizes.length > 0 ? ` con tallas ${sizes.join(", ")}` : "";

  return `${name}${colorCopy}${sizeCopy}, sincronizado desde Printful para el universo oficial de Many Ross.`;
}

export async function getPrintfulCatalog(): Promise<StoreProduct[]> {
  const listResponse = await printfulFetch<PrintfulListResponse>("/store/products");
  const listItems = Array.isArray(listResponse.result) ? listResponse.result : [];

  if (listItems.length === 0) {
    return [];
  }

  const detailedResults = await Promise.allSettled(
    listItems.slice(0, 12).map(async (item) => {
      const productId = toStringValue(item.id);
      if (!productId) {
        return null;
      }

      const detailResponse = await printfulFetch<{ result?: UnknownRecord }>(`/store/products/${productId}`);
      const result = detailResponse.result && typeof detailResponse.result === "object" ? detailResponse.result : {};
      const syncProduct = (result.sync_product && typeof result.sync_product === "object" ? result.sync_product : {}) as UnknownRecord;
      const variants = toArray(result.sync_variants).map((variant) => normalizeVariant(variant, toStringValue(syncProduct.thumbnail_url)));
      const price = variants.find((variant) => variant.price !== null)?.price ?? null;
      const currency = variants.find((variant) => variant.currency)?.currency ?? "USD";
      const name = toStringValue(syncProduct.name) || item.name || "Producto Many Ross";
      const imageUrl = toStringValue(syncProduct.thumbnail_url) || variants.find((variant) => variant.imageUrl)?.imageUrl || "/images/titanio-y-salitre-cover.png";

      return {
        id: productId,
        externalId: toStringValue(syncProduct.external_id) || item.external_id || null,
        name,
        description: buildDescription(name, variants),
        imageUrl,
        price,
        currency,
        badges: [variants.length > 1 ? "Variantes reales" : "Catalogo real"],
        availability: normalizeAvailability(syncProduct, variants),
        variantCount: variants.length,
        variants,
        source: "printful",
      } satisfies StoreProduct;
    }),
  );

  const products = detailedResults
    .flatMap((result) => (result.status === "fulfilled" && result.value ? [result.value] : []))
    .filter((product) => product.variantCount > 0 || product.availability !== "archived");

  if (products.length > 0) {
    return products;
  }

  const rejected = detailedResults.find((result) => result.status === "rejected");
  if (rejected && rejected.reason instanceof Error) {
    throw rejected.reason;
  }

  return [];
}
