import type { StoreProduct, StoreProductImage, StoreProductVariant } from "@/types/store";

const PLACEHOLDER_IMAGE = "/images/mockup-placeholder.svg";

function dedupeImages(images: StoreProductImage[]) {
  const seen = new Set<string>();
  const result: StoreProductImage[] = [];

  for (const image of images) {
    if (!image?.url || seen.has(image.url)) {
      continue;
    }

    seen.add(image.url);
    result.push(image);
  }

  return result;
}

function buildPlaceholderGallery(): StoreProductImage[] {
  return [
    {
      url: PLACEHOLDER_IMAGE,
      label: "Mockup en preparacion",
      role: "placeholder",
    },
  ];
}

function getColorVariants(product: StoreProduct, color: string | null | undefined) {
  if (!color) {
    return [];
  }

  return product.variants.filter((variant) => variant.color === color);
}

export function getGalleryImagesForSelection(
  product: StoreProduct,
  selectedVariant: StoreProductVariant | null | undefined,
  selectedColor: string | null | undefined,
) {
  const colorVariants = getColorVariants(product, selectedColor);
  const colorScopedImages = dedupeImages(colorVariants.flatMap((variant) => variant.images));

  if (colorScopedImages.length > 0) {
    return colorScopedImages;
  }

  const variantImages = dedupeImages(selectedVariant?.images ?? []);
  if (variantImages.length > 0) {
    return variantImages;
  }

  const productImages = dedupeImages(product.images ?? []);
  if (productImages.length > 0) {
    return productImages;
  }

  return buildPlaceholderGallery();
}

export function getPrimaryImageForSelection(
  product: StoreProduct,
  selectedVariant: StoreProductVariant | null | undefined,
  selectedColor: string | null | undefined,
  galleryImages?: StoreProductImage[],
) {
  const resolvedGallery = galleryImages ?? getGalleryImagesForSelection(product, selectedVariant, selectedColor);
  const colorVariants = getColorVariants(product, selectedColor);

  const selectedVariantImage = selectedVariant?.imageUrl;
  if (selectedVariantImage && resolvedGallery.some((image) => image.url === selectedVariantImage)) {
    return selectedVariantImage;
  }

  const colorVariantImage = colorVariants.map((variant) => variant.imageUrl).find((url) => Boolean(url));
  if (colorVariantImage && resolvedGallery.some((image) => image.url === colorVariantImage)) {
    return colorVariantImage;
  }

  if (resolvedGallery[0]?.url) {
    return resolvedGallery[0].url;
  }

  return product.imageUrl || PLACEHOLDER_IMAGE;
}

export function getPlaceholderImageUrl() {
  return PLACEHOLDER_IMAGE;
}
