"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";

import { QuantityControl } from "@/components/cart/quantity-control";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/currency";
import type { CartItem } from "@/types/cart";

type CartItemRowProps = {
  item: CartItem;
  compact?: boolean;
};

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const { removeItem } = useCart();
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <article className="glass-panel flex min-w-0 gap-4 rounded-[28px] p-4">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-black/30">
        {item.image ? (
          <Image src={item.image} alt={item.productName} fill sizes="96px" className="object-cover" unoptimized={item.image.startsWith("http")} />
        ) : null}
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className={compact ? "flex min-w-0 flex-col gap-2" : "flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"}>
          <div className="min-w-0">
            <h3 className="mobile-safe-title font-display text-lg uppercase tracking-[0.12em] text-ivory compact-tracking">
              {item.productName}
            </h3>
            <p className="mobile-safe-copy text-sm text-white/56">{item.variantName}</p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-gold">{formatCurrency(lineTotal, item.currency)}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] compact-tracking">
          {item.color ? <span className="rounded-full border border-white/12 px-3 py-2 text-white/70">{item.color}</span> : null}
          {item.size ? <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-gold">{item.size}</span> : null}
          <span className="rounded-full border border-white/12 px-3 py-2 text-white/70">{formatCurrency(item.unitPrice, item.currency)} c/u</span>
        </div>

        <div className={compact ? "flex flex-col gap-3" : "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"}>
          <QuantityControl cartItemId={item.cartItemId} quantity={item.quantity} />
          <button
            type="button"
            aria-label={`Eliminar ${item.productName} del carrito`}
            className="inline-flex items-center gap-2 self-start rounded-full border border-[#5E0D13]/40 bg-[#5E0D13]/20 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#ffb1b1] transition hover:bg-[#5E0D13]/30 compact-tracking"
            onClick={() => removeItem(item.cartItemId)}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
