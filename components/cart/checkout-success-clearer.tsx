"use client";

import { useEffect, useRef } from "react";

import { useCart } from "@/components/cart/cart-provider";

export function CheckoutSuccessClearer({ shouldClear }: { shouldClear: boolean }) {
  const { clearCart } = useCart();
  const hasClearedRef = useRef(false);

  useEffect(() => {
    if (!shouldClear || hasClearedRef.current) {
      return;
    }

    clearCart({ silent: true });
    hasClearedRef.current = true;
  }, [clearCart, shouldClear]);

  return null;
}
