import type {
  StoreApiErrorCode,
  StoreProduct,
  StoreProductImage,
  StoreProductImageRole,
  StoreProductVariant,
} from "@/types/store";

const PRINTFUL_API_BASE = "https://api.printful.com";
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRIES = 2;
const PLACEHOLDER_IMAGE = "/images/mockup-placeholder.svg";

type UnknownRecord = Record<string, unknown>;

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

type ImageCandidate = {
  url: string;
  role: StoreProductImageRole;
  score: number;
  label: string;
  debug: string;
};

type SelectedImages = {
  primary: string;
  images: StoreProductImage[];
  debug: string | null;
  hasRealMockup: boolean;
};

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

function normalizeDescriptor(parts: Array<string | null>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function inferImageRole(descriptor: string): StoreProductImageRole {
  if (descriptor.includes("front") || descriptor.includes("frontal") || descriptor.includes("front-view")) {
    return "front";
  }

  if (descriptor.includes("model") || descriptor.includes("mannequin") || descriptor.includes("wear") || descriptor.includes("lifestyle") || descriptor.includes("person")) {
    return "model";
  }

  if (descriptor.includes("back") || descriptor.includes("rear") || descriptor.includes("posterior")) {
    return "back";
  }

  if (descriptor.includes("detail") || descriptor.includes("close") || descriptor.includes("zoom")) {
    return "detail";
  }

  if (descriptor.includes("mockup") || descriptor.includes("shirt") || descriptor.includes("t-shirt") || descriptor.includes("tee") || descriptor.includes("hoodie") || descriptor.includes("cap") || descriptor.includes("hat") || descriptor.includes("product")) {
    return "product";
  }

  return "thumbnail";
}

function isArtworkLikeDescriptor(descriptor: string) {
  return [
    "artwork",
    "printfile",
    "print-file",
    "design",
    "poster",
    "album",
    "cover",
    "instagram",
    "square",
    "art print",
    "wall art",
  ].some((token) => descriptor.includes(token));
}

function labelForRole(role: StoreProductImageRole) {
  switch (role) {
    case "front":
      return "Vista frontal";
    case "back":
      return "Vista trasera";
    case "detail":
      return "Detalle";
    case "model":
      return "Modelo";
    case "product":
      return "Producto";
    case "thumbnail":
      return "Thumbnail";
    default:
      return "Mockup en preparacion";
  }
}

function scoreCandidate(url: string, descriptor: string, role: StoreProductImageRole, sourceHint: string) {
  let score = 0;

  switch (role) {
    case "front":
      score += 600;
      break;
    case "model":
      score += 520;
      break;
    case "back":
      score += 430;
      break;
    case "detail":
      score += 360;
      break;
    case "product":
      score += 300;
      break;
    case "thumbnail":
      score += 180;
      break;
    default:
      break;
  }

  if (sourceHint.includes("preview")) {
    score += 40;
  }

  if (sourceHint.includes("thumbnail")) {
    score -= 20;
  }

  if (descriptor.includes("white") || descriptor.includes("studio") || descriptor.includes("isolated")) {
    score += 20;
  }

  if (descriptor.includes("flat") || descriptor.includes("folded")) {
    score += 12;
  }

  if (isArtworkLikeDescriptor(descriptor)) {
    score -= 500;
  }

  if (url.includes("printfiles") || url.includes("artwork") || url.includes("design")) {
    score -= 500;
  }

  return score;
}

function buildCandidate(url: string | null, descriptorParts: Array<string | null>, sourceHint: string): ImageCandidate | null {
  if (!url) {
    return null;
  }

  const descriptor = normalizeDescriptor([...descriptorParts, sourceHint, url]);
  const role = inferImageRole(descriptor);
  const score = scoreCandidate(url, descriptor, role, sourceHint);

  return {
    url,
    role,
    score,
    label: labelForRole(role),
    debug: `${sourceHint}:${descriptor}`,
  };
}

function dedupeAndSelectImages(candidates: Array<ImageCandidate | null>): SelectedImages {
  const byUrl = new Map<string, ImageCandidate>();

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const current = byUrl.get(candidate.url);
    if (!current || candidate.score > current.score) {
      byUrl.set(candidate.url, candidate);
    }
  }

  const ordered = Array.from(byUrl.values()).sort((a, b) => b.score - a.score);
  const usable = ordered.filter((candidate) => candidate.score >= 180 && candidate.role !== "thumbnail");
  const backup = ordered.filter((candidate) => candidate.score >= 120);
  const chosen = usable.length > 0 ? usable : backup;
  const hasRealMockup = usable.length > 0;

  if (chosen.length === 0 || !hasRealMockup) {
    return {
      primary: PLACEHOLDER_IMAGE,
      images: [{ url: PLACEHOLDER_IMAGE, role: "placeholder", label: "Mockup en preparacion" }],
      debug: ordered[0]?.debug || "Printful no devolvio mockups aptos para mostrar como prenda.",
      hasRealMockup: false,
    };
  }

  return {
    primary: chosen[0].url,
    images: chosen.slice(0, 4).map((candidate) => ({
      url: candidate.url,
      role: candidate.role,
      label: candidate.label,
    })),
    debug: chosen[0]?.debug || null,
    hasRealMockup,
  };
}

function buildProductImageCandidates(record: UnknownRecord, fallbackThumbnail: string | null) {
  const recordDescriptor = normalizeDescriptor([
    toStringValue(record.name),
    toStringValue(record.title),
    toStringValue(record.type),
    toStringValue(record.placement),
    toStringValue(record.option),
    toStringValue(record.technique),
  ]);

  const files = toArray(record.files);
  const fileCandidates = files.flatMap((file) => {
    const fileDescriptorParts = [
      toStringValue(file.name),
      toStringValue(file.filename),
      toStringValue(file.title),
      toStringValue(file.type),
      toStringValue(file.placement),
      toStringValue(file.option),
      toStringValue(file.display_name),
      toStringValue(file.position),
      recordDescriptor,
    ];

    return [
      buildCandidate(toStringValue(file.preview_url), fileDescriptorParts, "file-preview"),
      buildCandidate(toStringValue(file.thumbnail_url), fileDescriptorParts, "file-thumbnail"),
      buildCandidate(toStringValue(file.url), fileDescriptorParts, "file-url"),
    ];
  });

  return [
    buildCandidate(toStringValue(record.preview_url), [recordDescriptor], "record-preview"),
    buildCandidate(toStringValue(record.image_url), [recordDescriptor], "record-image"),
    buildCandidate(toStringValue(record.product_image), [recordDescriptor], "record-product-image"),
    buildCandidate(toStringValue(record.thumbnail_url), [recordDescriptor], "record-thumbnail"),
    buildCandidate(fallbackThumbnail, [recordDescriptor], "fallback-thumbnail"),
    ...fileCandidates,
  ];
}

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeProductName(rawName: string) {
  const normalized = rawName.trim();
  const upper = normalized.toUpperCase();

  if (upper.includes("MANY ROSS") && upper.includes("T-SHIRT") && upper.includes("002")) {
    return "Camiseta Many Ross - Nivel Leyenda";
  }

  if (upper.includes("NIVEL LEYENDA") && upper.includes("T-SHIRT")) {
    return "Camiseta Many Ross - Nivel Leyenda";
  }

  if (upper.includes("T-SHIRT") || upper.includes("TEE")) {
    return "Camiseta Many Ross";
  }

  if (upper.includes("HOODIE")) {
    return "Hoodie Many Ross";
  }

  if (upper.includes("CAP") || upper.includes("HAT")) {
    return "Gorra Many Ross";
  }

  return normalized
    .replace(/^MANY ROSS\s*/i, "")
    .replace(/\b(T-SHIRT|TEE|HOODIE|CAP|HAT)\b/gi, (match) => match.toUpperCase())
    .replace(/\s{2,}/g, " ")
    .trim() || toTitleCase(normalized);
}

function buildMarketingDescription(name: string) {
  if (name.includes("Nivel Leyenda")) {
    return "Camiseta oficial Many Ross con diseno Nivel Leyenda.";
  }

  if (name.includes("Camiseta")) {
    return "Camiseta oficial Many Ross con presencia premium y estilo urbano.";
  }

  if (name.includes("Hoodie")) {
    return "Hoodie oficial Many Ross para un look premium de escenario y calle.";
  }

  if (name.includes("Gorra")) {
    return "Gorra oficial Many Ross para completar el drop con identidad propia.";
  }

  return "Producto oficial Many Ross creado para una compra rapida y clara.";
}

function normalizeVariant(record: UnknownRecord, fallbackImage: string | null): StoreProductVariant {
  const product = (record.product && typeof record.product === "object" ? record.product : null) as UnknownRecord | null;
  const size = toStringValue(record.size) || toStringValue(product?.size);
  const color = toStringValue(record.color) || toStringValue(product?.color);
  const selectedImages = dedupeAndSelectImages([
    ...buildProductImageCandidates(record, fallbackImage),
    ...buildProductImageCandidates(product || {}, fallbackImage),
  ]);

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
    imageUrl: selectedImages.primary,
    images: selectedImages.images,
    imageDebug: selectedImages.debug,
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

function selectProductImages(syncProduct: UnknownRecord, item: PrintfulListItem, variants: StoreProductVariant[]) {
  const fallbackThumbnail = toStringValue(syncProduct.thumbnail_url) || item.thumbnail_url || null;
  const variantCandidates = variants.flatMap((variant) =>
    variant.images.map((image) =>
      buildCandidate(image.url, [image.label, variant.name], `variant-${image.role}`),
    ),
  );

  return dedupeAndSelectImages([
    ...buildProductImageCandidates(syncProduct, fallbackThumbnail),
    buildCandidate(item.thumbnail_url || null, [item.name || null], "list-thumbnail"),
    ...variantCandidates,
  ]);
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
      const selectedImages = selectProductImages(syncProduct, item, variants);
      const price = variants.find((variant) => variant.price !== null)?.price ?? null;
      const currency = variants.find((variant) => variant.currency)?.currency ?? "USD";
      const rawName = toStringValue(syncProduct.name) || item.name || "Producto Many Ross";
      const name = normalizeProductName(rawName);

      return {
        id: productId,
        externalId: toStringValue(syncProduct.external_id) || item.external_id || null,
        name,
        description: buildMarketingDescription(name),
        imageUrl: selectedImages.primary,
        images: selectedImages.images,
        imageDebug: selectedImages.debug,
        hasRealMockup: selectedImages.hasRealMockup,
        price,
        currency,
        badges: ["Catalogo oficial"],
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
