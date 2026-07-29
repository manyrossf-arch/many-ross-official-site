import Link from "next/link";
import type Stripe from "stripe";

import { CheckoutSuccessClearer } from "@/components/cart/checkout-success-clearer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCurrency } from "@/lib/currency";
import {
  convertMinorUnitsToAmount,
  getStripeClient,
} from "@/lib/stripe";

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

async function getCheckoutSession(sessionId: string) {
  const stripe = getStripeClient();

  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items.data.price.product"],
  });
}

function isPaidSession(session: Stripe.Checkout.Session) {
  return session.payment_status === "paid";
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim();

  let session: Stripe.Checkout.Session | null = null;
  let errorMessage = "";

  if (!sessionId) {
    errorMessage = "Falta el identificador de la sesion de Stripe.";
  } else {
    try {
      session = await getCheckoutSession(sessionId);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "No se pudo recuperar la sesion de pago.";
    }
  }

  const paid = session ? isPaidSession(session) : false;
  const total = formatCurrency(
    convertMinorUnitsToAmount(session?.amount_total ?? 0, session?.currency ?? "USD"),
    session?.currency?.toUpperCase() || "USD",
  );
  const items = session?.line_items?.data ?? [];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-shell py-16">
        <div className="glass-panel rounded-[38px] p-8 sm:p-10">
          <CheckoutSuccessClearer shouldClear={paid} />
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="space-y-5 min-w-0">
              <p className="eyebrow">Stripe Checkout</p>
              <h1 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
                {paid ? "Pago confirmado en modo prueba" : "Sesion de pago recibida"}
              </h1>
              <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/62">
                {paid
                  ? "Stripe confirmo el pago de prueba. El carrito local se vacio de forma segura y la siguiente fase quedara lista para conectar pedidos reales en Printful."
                  : errorMessage || "La sesion existe, pero el pago todavia no aparece como confirmado. Si cancelaste el proceso, puedes volver al carrito sin perder tu seleccion."}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-gold/30 bg-gold px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-black compact-tracking">
                  Volver al inicio
                </Link>
                <Link href="/cart" className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-white/12 px-5 py-3 text-center text-xs uppercase tracking-[0.16em] text-white/74 compact-tracking">
                  Ver carrito
                </Link>
              </div>
            </div>

            <aside className="rounded-[30px] border border-white/10 bg-black/30 p-6 min-w-0">
              <h2 className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                Resumen de la sesion
              </h2>
              <div className="mt-6 space-y-3 text-sm text-white/62">
                <div className="flex items-center justify-between gap-4">
                  <span>Sesion</span>
                  <span className="truncate text-right text-white/72">{session?.id || "No disponible"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>Estado</span>
                  <span className={paid ? "text-gold" : "text-white/72"}>{session?.payment_status || "Sin confirmar"}</span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="mobile-safe-title text-sm uppercase tracking-[0.12em] text-ivory compact-tracking">{item.description}</p>
                      <p className="text-xs text-white/48">Cantidad: {item.quantity || 1}</p>
                    </div>
                    <span className="shrink-0 text-gold">
                      {formatCurrency(
                        convertMinorUnitsToAmount(item.amount_total ?? 0, session?.currency ?? "USD"),
                        session?.currency?.toUpperCase() || "USD",
                      )}
                    </span>
                  </div>
                ))}
                <div className="luxury-divider" />
                <div className="flex items-center justify-between gap-4 text-base text-ivory">
                  <span>Total</span>
                  <span className="font-semibold text-gold">{total}</span>
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
