"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getAvailableColorsForSize,
  getAvailableSizesForColor,
  getInitialSelection,
  getMatchingVariant,
  getPrimaryVariant,
  getProductColors,
  getProductSizes,
} from "@/lib/product-variants";
import type { StoreProduct } from "@/types/store";

export function useProductSelection(product: StoreProduct) {
  const initialSelection = useMemo(() => getInitialSelection(product), [product]);
  const [selectedColor, setSelectedColor] = useState(initialSelection.color);
  const [selectedSize, setSelectedSize] = useState(initialSelection.size);

  useEffect(() => {
    setSelectedColor(initialSelection.color);
    setSelectedSize(initialSelection.size);
  }, [initialSelection.color, initialSelection.size, product.id]);

  const colors = useMemo(() => getProductColors(product), [product]);
  const sizes = useMemo(() => getProductSizes(product), [product]);
  const availableSizes = useMemo(() => getAvailableSizesForColor(product, selectedColor), [product, selectedColor]);
  const availableColors = useMemo(() => getAvailableColorsForSize(product, selectedSize), [product, selectedSize]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      const currentVariant = getMatchingVariant(product, { color: selectedColor, size: selectedSize });
      if (!currentVariant) {
        setSelectedSize("");
      }
    }
  }, [product, selectedColor, selectedSize]);

  const selectedVariant = useMemo(() => {
    const exact = getMatchingVariant(product, { color: selectedColor, size: selectedSize });
    return exact || getPrimaryVariant(product, { color: selectedColor, size: selectedSize });
  }, [product, selectedColor, selectedSize]);

  const requiresColor = colors.length > 1;
  const requiresSize = sizes.length > 1;
  const missingSelection =
    (requiresColor && !selectedColor) ||
    (requiresSize && !selectedSize);

  return {
    selectedColor,
    selectedSize,
    setSelectedColor,
    setSelectedSize,
    colors,
    sizes,
    availableSizes,
    availableColors,
    selectedVariant,
    requiresColor,
    requiresSize,
    missingSelection,
  };
}
