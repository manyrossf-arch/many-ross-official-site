import "server-only";

import Stripe from "stripe";

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

let stripeClient: Stripe | null = null;

function readPrivateEnv(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET") {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Falta la variable privada ${name}.`);
  }

  return value;
}

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  stripeClient = new Stripe(readPrivateEnv("STRIPE_SECRET_KEY"), {
    appInfo: {
      name: "Many Ross Universo",
      version: "0.1.0",
    },
  });

  return stripeClient;
}

export function getStripeWebhookSecret() {
  return readPrivateEnv("STRIPE_WEBHOOK_SECRET");
}

export function getCheckoutSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback = process.env.NODE_ENV === "production" ? null : "http://localhost:3000";
  const siteUrl = configured || fallback;

  if (!siteUrl) {
    throw new Error("Falta NEXT_PUBLIC_SITE_URL para construir las URLs de Stripe Checkout.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(siteUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL no contiene una URL valida.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL debe usar http o https.");
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

export function convertAmountToMinorUnits(amount: number, currency: string) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("El monto para Stripe debe ser un numero valido y no negativo.");
  }

  const normalizedCurrency = currency.trim().toUpperCase();
  const multiplier = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 1 : 100;

  return Math.round((amount + Number.EPSILON) * multiplier);
}

export function convertMinorUnitsToAmount(amount: number | null, currency: string | null) {
  if (amount === null || !Number.isFinite(amount)) {
    return 0;
  }

  const normalizedCurrency = currency?.trim().toUpperCase() || "USD";
  const divisor = ZERO_DECIMAL_CURRENCIES.has(normalizedCurrency) ? 1 : 100;

  return amount / divisor;
}
