import type { StoreCatalogSource } from "@/types/store";

export type CartItem = {
  cartItemId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  size: string | null;
  color: string | null;
  image: string | null;
  unitPrice: number;
  currency: string;
  quantity: number;
  availability: string | null;
  source: Extract<StoreCatalogSource, "printful">;
};

export type AddCartItemInput = Omit<CartItem, "cartItemId" | "quantity" | "source"> & {
  quantity?: number;
  source: StoreCatalogSource;
};

export type CartTotals = {
  totalItems: number;
  subtotal: number;
  currency: string;
};
