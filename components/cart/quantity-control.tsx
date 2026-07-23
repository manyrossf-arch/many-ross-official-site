"use client";

import { Minus, Plus } from "lucide-react";

import { CART_MAX_QUANTITY, useCart } from "@/components/cart/cart-provider";

type QuantityControlProps = {
  cartItemId: string;
  quantity: number;
};

export function QuantityControl({ cartItemId, quantity }: QuantityControlProps) {
  const { updateQuantity } = useCart();

  return (
    <div className="inline-flex items-center rounded-full border border-white/12 bg-white/[0.03]">
      <button
        type="button"
        aria-label="Reducir cantidad"
        className="inline-flex h-10 w-10 items-center justify-center text-white/74 transition hover:text-gold disabled:cursor-not-allowed disabled:text-white/25"
        onClick={() => updateQuantity(cartItemId, quantity - 1)}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-[2.5rem] text-center text-sm font-semibold text-ivory">{quantity}</span>
      <button
        type="button"
        aria-label="Aumentar cantidad"
        className="inline-flex h-10 w-10 items-center justify-center text-white/74 transition hover:text-gold disabled:cursor-not-allowed disabled:text-white/25"
        onClick={() => updateQuantity(cartItemId, quantity + 1)}
        disabled={quantity >= CART_MAX_QUANTITY}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
