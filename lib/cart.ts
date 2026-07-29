import type { AddCartItemInput, CartItem, CartTotals } from "@/types/cart";

import { hasMockLikeId, isPrintfulSource } from "@/lib/store-purchase";

export const CART_STORAGE_KEY = "many-ross-cart-v1";
export const CART_MIN_QUANTITY = 1;
export const CART_MAX_QUANTITY = 10;

function toStringValue(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
}

function toNumberValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function clampQuantity(quantity: number) {
  return Math.min(CART_MAX_QUANTITY, Math.max(CART_MIN_QUANTITY, Math.trunc(quantity)));
}

export function createCartItemId(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

export function isValidCartInput(input: AddCartItemInput) {
  if (!isPrintfulSource(input.source)) {
    return false;
  }

  if (!input.productId.trim() || hasMockLikeId(input.variantId)) {
    return false;
  }

  if (!Number.isFinite(input.unitPrice) || input.unitPrice < 0 || !input.currency.trim()) {
    return false;
  }

  const availability = input.availability?.trim().toLowerCase() || "";
  return availability === "active" || availability === "in_stock";
}

export function buildCartItem(input: AddCartItemInput): CartItem | null {
  if (!isValidCartInput(input)) {
    return null;
  }

  return {
    cartItemId: createCartItemId(input.productId, input.variantId),
    productId: input.productId,
    variantId: input.variantId,
    productName: input.productName,
    variantName: input.variantName,
    size: input.size,
    color: input.color,
    image: input.image,
    unitPrice: input.unitPrice,
    currency: input.currency,
    quantity: clampQuantity(input.quantity ?? 1),
    availability: input.availability,
    source: "printful",
  };
}

export function sanitizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items: CartItem[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const record = entry as Record<string, unknown>;
    const productId = toStringValue(record.productId);
    const variantId = toStringValue(record.variantId);
    const productName = toStringValue(record.productName);
    const variantName = toStringValue(record.variantName);
    const unitPrice = toNumberValue(record.unitPrice);
    const currency = toStringValue(record.currency);
    const quantity = toNumberValue(record.quantity);
    const source = toStringValue(record.source);
    const availability = toStringValue(record.availability);

    if (!productId || !variantId || !productName || !variantName || unitPrice === null || !currency || quantity === null) {
      continue;
    }

    const nextItem = buildCartItem({
      productId,
      variantId,
      productName,
      variantName,
      size: toStringValue(record.size),
      color: toStringValue(record.color),
      image: toStringValue(record.image),
      unitPrice,
      currency,
      quantity,
      availability,
      source: isPrintfulSource(source) ? source : "demo",
    });

    if (!nextItem) {
      continue;
    }

    items.push(nextItem);
  }

  return items;
}

export function getCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const currency = items[0]?.currency || "USD";

  return { subtotal, totalItems, currency };
}
