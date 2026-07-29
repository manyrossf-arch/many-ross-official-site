"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatCurrency } from "@/lib/currency";
import { getPrimaryImageForSelection } from "@/lib/store-gallery";
import { cn } from "@/lib/utils";
import type { StoreProduct } from "@/types/store";

import { StoreProductImageFrame } from "./store-product-media";

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest("a, button, summary, input, select, textarea"));
}

function ProductBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-gold compact-eyebrow">
      {label}
    </span>
  );
}

export function StoreProductDisplay({ product, featured = false }: { product: StoreProduct; featured?: boolean }) {
  const router = useRouter();
  const detailHref = `/store/${encodeURIComponent(product.id)}`;
  const badgeLabel = product.source === "printful" ? "Catálogo oficial" : "Vista previa";
  const price = product.price ?? 0;
  const currency = product.currency ?? "USD";
  const primaryImage = getPrimaryImageForSelection(product, product.variants[0] ?? null, product.variants[0]?.color);

  const handleNavigate = () => {
    router.push(detailHref);
  };

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    handleNavigate();
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleNavigate();
  };

  const visual = (
    <div className="space-y-4">
      <Link
        href={detailHref}
        aria-label={`Ver producto ${product.name}`}
        className="block rounded-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <StoreProductImageFrame image={primaryImage} alt={product.name} featured={featured} priority={featured} />
      </Link>
    </div>
  );

  const details = (
    <div className="min-w-0 space-y-4">
      <ProductBadge label={badgeLabel} />
      <div className="min-w-0 space-y-2">
        <Link
          href={detailHref}
          className="inline-block max-w-full rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <h3 className={cn("mobile-safe-title font-display leading-[1.05] text-ivory", featured ? "text-[clamp(1.8rem,5vw,3rem)]" : "text-[clamp(1.35rem,4.2vw,1.9rem)]")}>
            {product.name}
          </h3>
        </Link>
        <p className="text-xl font-semibold text-gold">{formatCurrency(price, currency)}</p>
      </div>
      <Link
        href={detailHref}
        className={cn(
          "inline-flex min-h-[3rem] w-full max-w-full items-center justify-center rounded-full border px-5 py-3 text-center text-sm font-medium transition whitespace-normal",
          featured ? "border-gold/30 bg-gold text-black hover:brightness-110" : "border-gold/25 bg-gold/10 text-gold hover:bg-gold/20",
        )}
      >
        <span className="text-balance">Ver producto</span>
      </Link>
    </div>
  );

  if (featured) {
    return (
      <article
        role="link"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        className="glass-panel relative overflow-hidden rounded-[40px] border border-gold/20 p-4 outline-none transition hover:border-gold/30 sm:p-6 lg:p-8"
        aria-label={`Abrir ${product.name}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,75,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(94,13,19,0.22),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-8">
          <div className="order-1 min-w-0 lg:order-2">{visual}</div>
          <div className="order-2 min-w-0 lg:order-1">{details}</div>
        </div>
      </article>
    );
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className="glass-panel group min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 outline-none transition hover:border-gold/20 sm:p-5"
      aria-label={`Abrir ${product.name}`}
    >
      <div className="space-y-5">
        {visual}
        {details}
      </div>
    </article>
  );
}