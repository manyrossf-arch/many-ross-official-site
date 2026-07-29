import "server-only";

import { demoStoreProducts } from "@/lib/demo-store";
import { getPrintfulCatalog, hasPrintfulToken } from "@/lib/printful/client";
import type { StoreProduct } from "@/types/store";

export const STORE_REVALIDATE_SECONDS = 120;

export type StoreProductLookupResult = {
  product: StoreProduct | null;
  source: "printful" | "demo" | "missing";
  reason?: "missing_token" | "not_found" | "upstream_error";
};

export async function getStoreProductById(productId: string): Promise<StoreProductLookupResult> {
  const demoProduct = demoStoreProducts.find((product) => product.id === productId) ?? null;

  if (demoProduct) {
    return {
      product: demoProduct,
      source: "demo",
    };
  }

  if (!hasPrintfulToken()) {
    return {
      product: null,
      source: "missing",
      reason: "missing_token",
    };
  }

  try {
    const products = await getPrintfulCatalog();
    const product = products.find((entry) => entry.id === productId) ?? null;

    if (!product) {
      return {
        product: null,
        source: "missing",
        reason: "not_found",
      };
    }

    return {
      product,
      source: "printful",
    };
  } catch {
    return {
      product: null,
      source: "missing",
      reason: "upstream_error",
    };
  }
}
