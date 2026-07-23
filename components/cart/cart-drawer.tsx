"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { CartItemRow } from "@/components/cart/cart-item";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/currency";

export function CartDrawer() {
  const { cartItems, subtotal, currency, isCartOpen, closeCart, totalItems } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        type="button"
        aria-label="Cerrar carrito"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeCart}
      />
      <aside
        aria-label="Tu carrito"
        className="relative z-10 flex h-full w-full max-w-[30rem] flex-col border-l border-white/10 bg-[#090909] px-4 py-4 shadow-2xl sm:px-6"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <h2 className="mobile-safe-title font-display text-2xl uppercase tracking-[0.12em] text-ivory compact-tracking">
              Tu carrito
            </h2>
            <p className="text-sm text-white/56">{totalItems} {totalItems === 1 ? "articulo" : "articulos"}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Cerrar carrito"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-white/78 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
            onClick={closeCart}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <h3 className="mobile-safe-title font-display text-2xl uppercase tracking-[0.12em] text-ivory compact-tracking">
              Tu carrito esta vacio
            </h3>
            <p className="mobile-safe-copy max-w-sm text-sm leading-7 text-white/60">
              Cuando elijas una variante real desde Printful, aparecera aqui lista para la siguiente fase de checkout.
            </p>
            <Link
              href="/#tienda"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-gold/20 bg-gold/10 px-5 py-3 text-xs uppercase tracking-[0.16em] text-gold compact-tracking"
              onClick={closeCart}
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-5 pr-1">
              {cartItems.map((item) => (
                <CartItemRow key={item.cartItemId} item={item} compact />
              ))}
            </div>
            <div className="space-y-4 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between gap-4 text-sm text-white/62">
                <span>Subtotal</span>
                <span className="text-base font-semibold text-gold">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/cart"
                  className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-white/12 px-5 py-3 text-center text-xs uppercase tracking-[0.16em] text-white/74 compact-tracking"
                  onClick={closeCart}
                >
                  Ver carrito
                </Link>
                <Link
                  href="/checkout"
                  className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-gold/30 bg-gold px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-black compact-tracking"
                  onClick={closeCart}
                >
                  Finalizar compra
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
