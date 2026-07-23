"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Image from "next/image";

import { useCart } from "@/components/cart/cart-provider";
import { useProductSelection } from "@/components/cart/use-product-selection";
import { ExternalLink } from "@/components/external-link";
import { formatCurrency } from "@/lib/currency";
import { siteConfig } from "@/lib/site-config";
import type { StoreProduct } from "@/types/store";

function OptionChip({ active, disabled, label, onClick, accent = "default" }: { active: boolean; disabled?: boolean; label: string; onClick: () => void; accent?: "default" | "gold"; }) {
  const activeClass = accent === "gold"
    ? "border-gold/30 bg-gold text-black"
    : "border-gold/20 bg-gold/10 text-gold";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={active
        ? `rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.14em] compact-eyebrow ${activeClass}`
        : "rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-white/68 transition hover:border-gold/20 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 compact-eyebrow"}
    >
      <span className="text-balance">{label}</span>
    </button>
  );
}

export function StoreProductDisplay({ product, featured = false }: { product: StoreProduct; featured?: boolean }) {
  const { addItem } = useCart();
  const {
    selectedColor,
    selectedSize,
    setSelectedColor,
    setSelectedSize,
    colors,
    sizes,
    availableSizes,
    availableColors,
    selectedVariant,
    requiresColor,
    requiresSize,
    missingSelection,
  } = useProductSelection(product);

  const price = selectedVariant?.price ?? product.price ?? 0;
  const currency = selectedVariant?.currency ?? product.currency ?? "USD";
  const image = selectedVariant?.imageUrl || product.imageUrl;
  const hasStoreLink = Boolean(siteConfig.links.merchDrop);
  const canAddToCart = Boolean(selectedVariant?.id) && !missingSelection;
  const helperMessage = missingSelection
    ? `Selecciona${requiresColor && !selectedColor ? " color" : ""}${requiresColor && !selectedColor && requiresSize && !selectedSize ? " y" : ""}${requiresSize && !selectedSize ? " talla" : ""} para continuar.`
    : selectedVariant
      ? `Variante lista: ${selectedVariant.name}.`
      : "No hay una variante valida disponible para esta combinacion.";

  const handleAddToCart = () => {
    if (!selectedVariant?.id || missingSelection || selectedVariant.price === null) {
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      image: selectedVariant.imageUrl || image,
      unitPrice: selectedVariant.price,
      currency: selectedVariant.currency || currency,
    });
  };

  if (featured) {
    return (
      <div className="glass-panel relative overflow-hidden rounded-[40px] border border-gold/20 p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,75,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(94,13,19,0.22),transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-gold compact-eyebrow">Pieza destacada</span>
              <span className="rounded-full border border-white/12 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/72 compact-eyebrow">{product.source === "printful" ? "Catalogo real" : "Demo visual"}</span>
            </div>
            <div className="min-w-0 space-y-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/46 compact-eyebrow">Nivel Leyenda Collection</p>
              <h3 className="mobile-safe-title font-display text-[clamp(2rem,7vw,3.75rem)] uppercase text-ivory compact-tracking leading-[0.98]">{product.name}</h3>
              <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/68">{product.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Precio</p>
                <p className="mt-2 text-lg font-semibold text-gold text-anywhere">{formatCurrency(price, currency)}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Estado</p>
                <p className="mt-2 text-sm uppercase tracking-[0.12em] text-white/78 compact-tracking text-balance">{product.availability}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Variantes</p>
                <p className="mt-2 text-sm uppercase tracking-[0.12em] text-white/78 compact-tracking text-balance">{product.variantCount} activas</p>
              </div>
            </div>
            {colors.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <OptionChip key={color} label={color} active={selectedColor === color} disabled={selectedSize ? !availableColors.includes(color) : false} onClick={() => setSelectedColor(color)} accent="gold" />
                  ))}
                </div>
              </div>
            ) : null}
            {sizes.length > 0 ? (
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Talla</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <OptionChip key={size} label={size} active={selectedSize === size} disabled={selectedColor ? !availableSizes.includes(size) : false} onClick={() => setSelectedSize(size)} />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-3">
              <p className="mobile-safe-copy text-sm leading-7 text-white/60">{helperMessage}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" disabled={!canAddToCart} onClick={handleAddToCart} className="inline-flex min-h-[3.5rem] max-w-full items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 whitespace-normal compact-tracking">
                  <span className="text-balance">Agregar al carrito</span>
                </button>
                {hasStoreLink ? (
                  <ExternalLink href={siteConfig.links.merchDrop} className="inline-flex min-h-[3.5rem] max-w-full items-center justify-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs uppercase tracking-[0.14em] text-white/64 whitespace-normal compact-tracking">
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-balance">Ver coleccion oficial</span>
                  </ExternalLink>
                ) : (
                  <span className="inline-flex min-h-[3.5rem] max-w-full items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs uppercase tracking-[0.14em] text-white/64 whitespace-normal compact-tracking">
                    <Sparkles className="h-4 w-4 shrink-0 text-gold" />
                    <span className="text-balance">Checkout seguro en la siguiente fase</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="relative min-w-0">
            <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.22),transparent_55%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/40">
              <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_50%,rgba(0,0,0,0.58)_100%)]" />
              <div className="relative aspect-[4/5] min-h-[360px] sm:min-h-[540px]">
                <Image src={image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover object-center" unoptimized={image.startsWith("http")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="glass-panel group min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
      <div className="relative aspect-[5/6] overflow-hidden bg-black/40">
        <Image src={image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" unoptimized={image.startsWith("http")} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(8,8,8,0.12)_35%,rgba(7,7,7,0.78)_100%)]" />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
          {product.badges.map((badge) => (
            <span key={badge} className="rounded-full border border-gold/30 bg-black/50 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-gold compact-eyebrow">{badge}</span>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/58 compact-eyebrow">Mockup principal</p>
            <h3 className="mobile-safe-title fluid-card-title compact-tracking mt-2 min-w-0 font-display uppercase text-ivory">{product.name}</h3>
          </div>
          <span className="w-fit max-w-full shrink-0 rounded-full border border-gold/25 bg-black/48 px-4 py-2 text-sm font-semibold text-gold backdrop-blur-sm text-anywhere">{formatCurrency(price, currency)}</span>
        </div>
      </div>
      <div className="min-w-0 space-y-5 p-6">
        <p className="mobile-safe-copy text-sm leading-7 text-white/66">{product.description}</p>
        {colors.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <OptionChip key={color} label={color} active={selectedColor === color} disabled={selectedSize ? !availableColors.includes(color) : false} onClick={() => setSelectedColor(color)} accent="gold" />
              ))}
            </div>
          </div>
        ) : null}
        {sizes.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Talla</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <OptionChip key={size} label={size} active={selectedSize === size} disabled={selectedColor ? !availableSizes.includes(size) : false} onClick={() => setSelectedSize(size)} />
              ))}
            </div>
          </div>
        ) : null}
        <p className="mobile-safe-copy text-sm leading-7 text-white/60">{helperMessage}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" disabled={!canAddToCart} onClick={handleAddToCart} className="inline-flex min-h-[3rem] max-w-full items-center justify-center rounded-full border border-gold/30 bg-gold/10 px-4 py-3 text-center text-sm uppercase tracking-[0.16em] text-gold transition hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-50 whitespace-normal compact-tracking">
            <span className="text-balance">Agregar al carrito</span>
          </button>
          {hasStoreLink ? (
            <ExternalLink href={siteConfig.links.merchDrop} className="inline-flex min-h-[3rem] max-w-full items-center gap-2 rounded-full border border-white/12 px-4 py-3 text-center text-sm uppercase tracking-[0.16em] text-white/68 transition hover:text-gold whitespace-normal compact-tracking">
              <ArrowUpRight className="h-4 w-4 shrink-0" />
              <span className="text-balance">Ver coleccion oficial</span>
            </ExternalLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
