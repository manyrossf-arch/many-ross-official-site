"use client";

import Link from "next/link";

import { CheckoutButton } from "@/components/cart/checkout-button";
import { useCart } from "@/components/cart/cart-provider";
import { CartItemRow } from "@/components/cart/cart-item";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/currency";

export default function CartPage() {
  const { cartItems, subtotal, currency, clearCart } = useCart();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-shell space-y-10 py-16">
        <div className="section-heading">
          <p className="eyebrow">Many Ross Universo</p>
          <h1 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
            Carrito de compras
          </h1>
          <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/60">
            Revisa tus variantes reales, ajusta cantidades y crea un checkout seguro donde el servidor valida precios y disponibilidad antes de enviarte a Stripe.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-panel rounded-[34px] p-8 text-center">
            <h2 className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
              Tu carrito esta vacio
            </h2>
            <p className="mobile-safe-copy mt-3 text-sm leading-7 text-white/60">
              Elige un producto real desde la tienda, selecciona su variante y vuelve aqui para revisar el pedido.
            </p>
            <Link href="/#tienda" className="mt-6 inline-flex min-h-[3rem] items-center justify-center rounded-full border border-gold/20 bg-gold/10 px-5 py-3 text-xs uppercase tracking-[0.16em] text-gold compact-tracking">
              Seguir comprando
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4 min-w-0">
              {cartItems.map((item) => (
                <CartItemRow key={item.cartItemId} item={item} />
              ))}
            </div>
            <aside className="glass-panel h-fit rounded-[34px] p-6 min-w-0">
              <h2 className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                Resumen
              </h2>
              <div className="mt-6 space-y-4 text-sm text-white/64">
                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="text-base font-semibold text-gold">{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Envio</span>
                  <span>Se calcula en Stripe Checkout</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Impuestos</span>
                  <span>Se calculan en Stripe Checkout</span>
                </div>
                <div className="luxury-divider" />
                <div className="flex items-center justify-between gap-4 text-base text-ivory">
                  <span>Total provisional</span>
                  <span className="font-semibold text-gold">{formatCurrency(subtotal, currency)}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <CheckoutButton />
                <Link href="/#tienda" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-white/12 px-5 py-3 text-center text-xs uppercase tracking-[0.16em] text-white/74 compact-tracking">
                  Seguir comprando
                </Link>
                <button type="button" onClick={() => clearCart()} className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-[#5E0D13]/40 bg-[#5E0D13]/20 px-5 py-3 text-center text-xs uppercase tracking-[0.16em] text-[#ffb1b1] compact-tracking">
                  Vaciar carrito
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
