import type { StoreProduct, StoreProductVariant } from "@/types/store";

export type VariantSelection = {
  color: string;
  size: string;
};

export function getProductColors(product: StoreProduct) {
  return Array.from(new Set(product.variants.map((variant) => variant.color).filter(Boolean) as string[]));
}

export function getProductSizes(product: StoreProduct) {
  return Array.from(new Set(product.variants.map((variant) => variant.size).filter(Boolean) as string[]));
}

export function getAvailableSizesForColor(product: StoreProduct, color: string) {
  return Array.from(
    new Set(
      product.variants
        .filter((variant) => (color ? variant.color === color : true))
        .map((variant) => variant.size)
        .filter(Boolean) as string[],
    ),
  );
}

export function getAvailableColorsForSize(product: StoreProduct, size: string) {
  return Array.from(
    new Set(
      product.variants
        .filter((variant) => (size ? variant.size === size : true))
        .map((variant) => variant.color)
        .filter(Boolean) as string[],
    ),
  );
}

export function getMatchingVariant(product: StoreProduct, selection: VariantSelection) {
  return product.variants.find((variant) => {
    const matchesColor = selection.color ? variant.color === selection.color : true;
    const matchesSize = selection.size ? variant.size === selection.size : true;
    return matchesColor && matchesSize;
  }) || null;
}

export function getInitialSelection(product: StoreProduct): VariantSelection {
  const colors = getProductColors(product);
  const sizes = getProductSizes(product);

  return {
    color: colors.length === 1 ? colors[0] ?? "" : "",
    size: sizes.length === 1 ? sizes[0] ?? "" : "",
  };
}

export function getPrimaryVariant(product: StoreProduct, selection: VariantSelection): StoreProductVariant | null {
  return getMatchingVariant(product, selection) || product.variants[0] || null;
}
