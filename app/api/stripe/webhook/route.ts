import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logWebhook(event: Stripe.Event, session?: Stripe.Checkout.Session) {
  console.info("[stripe-webhook]", {
    eventId: event.id,
    eventType: event.type,
    sessionId: session?.id || null,
    paymentStatus: session?.payment_status || null,
  });
}

async function handleCheckoutLifecycle(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  logWebhook(event, session);

  // Fase futura: aqui debemos persistir idempotencia por event.id y session.id
  // antes de crear la orden real en Printful para evitar duplicados.
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Falta la firma de Stripe." }, { status: 400 });
  }

  try {
    const rawBody = await request.text();
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(rawBody, signature, getStripeWebhookSecret());

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        await handleCheckoutLifecycle(event);
        break;
      default:
        console.info("[stripe-webhook] Evento ignorado", { eventId: event.id, eventType: event.type });
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo validar el webhook de Stripe.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
