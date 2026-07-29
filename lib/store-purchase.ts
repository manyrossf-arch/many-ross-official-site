import type { StoreCatalogSource, StoreProduct, StoreProductVariant } from "@/types/store";

const BLOCKED_VARIANT_PREFIXES = ["demo-", "mock-", "fallback-"] as const;
const PURCHASABLE_VARIANT_STATES = new Set(["active", "in_stock"]);

export function isPrintfulSource(source: StoreCatalogSource | string | null | undefined): source is "printful" {
  return source === "printful";
}

export function hasMockLikeId(value: string | null | undefined) {
  if (!value) {
    return true;
  }

  return BLOCKED_VARIANT_PREFIXES.some((prefix) => value.startsWith(prefix));
}

export function isPurchasableProduct(product: StoreProduct) {
  return isPrintfulSource(product.source) && product.availability === "active";
}

export function isPurchasableVariant(product: StoreProduct, variant: StoreProductVariant | null | undefined) {
  if (!variant || !isPurchasableProduct(product)) {
    return false;
  }

  if (hasMockLikeId(variant.id) || variant.price === null || !variant.currency) {
    return false;
  }

  const availability = variant.availability?.trim().toLowerCase() || "";
  return PURCHASABLE_VARIANT_STATES.has(availability);
}
