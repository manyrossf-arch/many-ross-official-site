"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";

export function CartButton() {
  const { totalItems, toggleCart, isHydrated } = useCart();
  const showCount = isHydrated && totalItems > 0;

  return (
    <button
      type="button"
      aria-label={`Abrir carrito${showCount ? ` con ${totalItems} articulos` : ""}`}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold transition hover:border-gold/40 hover:bg-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
      onClick={toggleCart}
    >
      <ShoppingBag className="h-5 w-5" />
      {showCount ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-[10px] font-semibold text-black">
          {totalItems}
        </span>
      ) : null}
    </button>
  );
}
