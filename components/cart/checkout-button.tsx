"use client";

import { useMemo, useRef, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  className?: string;
  errorClassName?: string;
  idleLabel?: string;
  loadingLabel?: string;
  onRedirectStart?: () => void;
};

type CheckoutResponse = {
  checkoutUrl?: string;
  sessionId?: string;
  step?: string;
  message?: string;
  missingEnv?: string | null;
  status?: number;
  error?: {
    status: number;
    message: string;
    details?: string | null;
  };
};

export function CheckoutButton({
  className,
  errorClassName,
  idleLabel = "Finalizar compra",
  loadingLabel = "Preparando pago seguro...",
  onRedirectStart,
}: CheckoutButtonProps) {
  const { cartItems, isHydrated } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inFlightRef = useRef(false);

  const payload = useMemo(
    () => ({
      items: cartItems.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    }),
    [cartItems],
  );

  const isDisabled = !isHydrated || cartItems.length === 0 || isSubmitting;

  async function handleCheckout() {
    if (isDisabled || inFlightRef.current) {
      return;
    }

    inFlightRef.current = true;
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as CheckoutResponse | null;

      if (!response.ok || !data?.checkoutUrl) {
        const apiMessage = data?.message || data?.error?.message || "No se pudo preparar el checkout seguro.";
        const apiStep = data?.step ? ` [${data.step}]` : "";
        const apiDetails = data?.error?.details ? ` ${data.error.details}` : "";
        throw new Error(`${apiMessage}${apiStep}${apiDetails}`.trim());
      }

      onRedirectStart?.();
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Se produjo un error inesperado al abrir Stripe Checkout.");
      setIsSubmitting(false);
      inFlightRef.current = false;
      return;
    }
  }

  return (
    <div className="space-y-2 min-w-0">
      <button
        type="button"
        className={cn(
          "inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-full border border-gold/30 bg-gold px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 compact-tracking",
          className,
        )}
        onClick={handleCheckout}
        disabled={isDisabled}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? loadingLabel : idleLabel}
      </button>
      <p className={cn("min-h-5 text-xs text-[#ffb1b1]", errorClassName)} aria-live="polite">
        {errorMessage}
      </p>
    </div>
  );
}
