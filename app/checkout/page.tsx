"use client";

import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/currency";

export default function CheckoutPage() {
  const { cartItems, subtotal, currency } = useCart();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-shell py-16">
        <div className="glass-panel rounded-[38px] p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-5 min-w-0">
              <p className="eyebrow">Checkout | Fase 2</p>
              <h1 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
                Estamos preparando el pago seguro
              </h1>
              <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/62">
                Tu carrito ya esta listo. En la siguiente fase, el servidor recibira solo los variantId y cantidades, validara los precios reales y creara una sesion segura de Stripe Checkout.
              </p>
              <p className="mobile-safe-copy text-sm leading-7 text-white/54">
                El envio y los impuestos se calcularan durante el flujo de pago seguro cuando conectemos Stripe y la validacion server-side del catalogo.
              </p>
              <Link href="/cart" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-white/12 px-5 py-3 text-center text-xs uppercase tracking-[0.16em] text-white/74 compact-tracking">
                Volver al carrito
              </Link>
            </div>

            <aside className="rounded-[30px] border border-white/10 bg-black/30 p-6 min-w-0">
              <h2 className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                Resumen actual
              </h2>
              <div className="mt-6 space-y-3 text-sm text-white/62">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mobile-safe-title text-sm uppercase tracking-[0.12em] text-ivory compact-tracking">{item.productName}</p>
                      <p className="text-xs text-white/48">{item.variantName} x {item.quantity}</p>
                    </div>
                    <span className="shrink-0 text-gold">{formatCurrency(item.unitPrice * item.quantity, item.currency)}</span>
                  </div>
                ))}
                <div className="luxury-divider" />
                <div className="flex items-center justify-between gap-4 text-base text-ivory">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gold">{formatCurrency(subtotal, currency)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
