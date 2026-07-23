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
};

export type AddCartItemInput = Omit<CartItem, "cartItemId" | "quantity"> & {
  quantity?: number;
};

export type CartTotals = {
  totalItems: number;
  subtotal: number;
  currency: string;
};
