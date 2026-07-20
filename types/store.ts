export type StoreCatalogSource = "demo" | "printful";

export type StoreProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  price: number | null;
  currency: string | null;
  availability: string | null;
  imageUrl: string | null;
};

export type StoreProduct = {
  id: string;
  externalId: string | null;
  name: string;
  description: string;
  imageUrl: string;
  price: number | null;
  currency: string | null;
  badges: string[];
  availability: "active" | "draft" | "archived" | "unknown";
  variantCount: number;
  variants: StoreProductVariant[];
  source: StoreCatalogSource;
};

export type StoreCatalogMeta = {
  source: StoreCatalogSource;
  count: number;
  fetchedAt: string;
  revalidateSeconds: number;
  fallbackReason?: "missing_token";
  message?: string;
};

export type StoreCatalogResponse = {
  source: StoreCatalogSource;
  products: StoreProduct[];
  meta: StoreCatalogMeta;
};

export type StoreApiErrorCode =
  | "PRINTFUL_UNAUTHORIZED"
  | "PRINTFUL_FORBIDDEN"
  | "PRINTFUL_NOT_FOUND"
  | "PRINTFUL_RATE_LIMITED"
  | "PRINTFUL_UPSTREAM_ERROR"
  | "PRINTFUL_NETWORK_ERROR"
  | "PRINTFUL_TIMEOUT"
  | "PRINTFUL_UNKNOWN_ERROR";

export type StoreApiErrorResponse = {
  error: {
    code: StoreApiErrorCode;
    status: number;
    message: string;
    retryable: boolean;
  };
};
