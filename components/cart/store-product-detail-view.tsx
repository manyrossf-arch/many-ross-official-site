"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { useProductSelection } from "@/components/cart/use-product-selection";
import { formatCurrency } from "@/lib/currency";
import { getGalleryImagesForSelection, getPrimaryImageForSelection } from "@/lib/store-gallery";
import { isPrintfulSource, isPurchasableVariant } from "@/lib/store-purchase";
import type { StoreProduct } from "@/types/store";

import { StoreProductGallery, StoreProductImageFrame, StoreProductLightbox } from "./store-product-media";

function OptionChip({
  active,
  disabled,
  label,
  onClick,
  accent = "default",
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  accent?: "default" | "gold";
}) {
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
        : "rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[10px] tracking-[0.02em] text-white/78 transition hover:border-gold/20 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"}
    >
      <span className="text-balance">{label}</span>
    </button>
  );
}

function ProductBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-gold compact-eyebrow">
      {label}
    </span>
  );
}

export function StoreProductDetailView({ product }: { product: StoreProduct }) {
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

  const isPreview = !isPrintfulSource(product.source);
  const galleryImages = useMemo(
    () => getGalleryImagesForSelection(product, selectedVariant, selectedColor),
    [product, selectedVariant, selectedColor],
  );
  const preferredImage = useMemo(
    () => getPrimaryImageForSelection(product, selectedVariant, selectedColor, galleryImages),
    [galleryImages, product, selectedColor, selectedVariant],
  );
  const [activeImageUrl, setActiveImageUrl] = useState(preferredImage);
  const [zoomOpen, setZoomOpen] = useState(false);
  const price = selectedVariant?.price ?? product.price ?? 0;
  const currency = selectedVariant?.currency ?? product.currency ?? "USD";
  const canAddToCart = !isPreview && !missingSelection && isPurchasableVariant(product, selectedVariant);
  const debugMessage = selectedVariant?.imageDebug || product.imageDebug;

  useEffect(() => {
    if (!galleryImages.some((image) => image.url === activeImageUrl) || activeImageUrl !== preferredImage) {
      setActiveImageUrl(preferredImage);
    }
  }, [activeImageUrl, galleryImages, preferredImage]);

  const helperMessage = isPreview
    ? "Vista previa editorial. Compra no disponible por ahora."
    : missingSelection
      ? `Selecciona${requiresColor && !selectedColor ? " color" : ""}${requiresColor && !selectedColor && requiresSize && !selectedSize ? " y" : ""}${requiresSize && !selectedSize ? " talla" : ""} para continuar.`
      : selectedVariant && canAddToCart
        ? `${selectedVariant.name} listo para agregar.`
        : "Esta combinacion no esta disponible.";

  const handleAddToCart = () => {
    if (!selectedVariant || !canAddToCart || !isPrintfulSource(product.source)) {
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      image: selectedVariant.imageUrl || activeImageUrl,
      unitPrice: selectedVariant.price ?? price,
      currency: selectedVariant.currency || currency,
      availability: selectedVariant.availability,
      source: product.source,
    });
  };

  return (
    <>
      <section className="section-shell py-12 sm:py-16">
        <div className="mb-8">
          <Link href="/#tienda" className="inline-flex min-h-[3rem] items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-white/72 transition hover:border-gold/20 hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-start">
          <div className="min-w-0 space-y-4">
            <StoreProductImageFrame image={activeImageUrl} alt={product.name} featured priority onClick={() => setZoomOpen(true)} />
            <StoreProductGallery images={galleryImages} activeUrl={activeImageUrl} onSelect={setActiveImageUrl} />
            {process.env.NODE_ENV !== "production" && !product.hasRealMockup ? (
              <div className="rounded-[22px] border border-[#7c5b19]/40 bg-[#7c5b19]/12 px-4 py-3 text-sm leading-7 text-[#f0d28a]">
                Mockup en preparacion: {debugMessage || "Printful no devolvio un mockup claro para esta prenda."}
              </div>
            ) : null}
          </div>

          <div className="glass-panel min-w-0 rounded-[36px] p-6 sm:p-8">
            <div className="space-y-6">
              <ProductBadge label={isPreview ? "Vista previa" : "Catálogo oficial"} />
              <div className="space-y-3 min-w-0">
                <h1 className="mobile-safe-title font-display text-[clamp(2rem,6vw,3.8rem)] leading-[1.02] text-ivory">{product.name}</h1>
                <p className="text-2xl font-semibold text-gold sm:text-3xl">{formatCurrency(price, currency)}</p>
                <p className="mobile-safe-copy max-w-2xl text-[clamp(1rem,3.8vw,1.08rem)] leading-7 text-white/68">{product.description}</p>
              </div>

              {!isPreview && colors.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white/86">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <OptionChip
                        key={color}
                        label={color}
                        active={selectedColor === color}
                        disabled={selectedSize ? !availableColors.includes(color) : false}
                        onClick={() => setSelectedColor(color)}
                        accent="gold"
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {!isPreview && sizes.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-white/86">Talla</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <OptionChip
                        key={size}
                        label={size}
                        active={selectedSize === size}
                        disabled={selectedColor ? !availableSizes.includes(size) : false}
                        onClick={() => setSelectedSize(size)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  disabled={!canAddToCart}
                  onClick={handleAddToCart}
                  className="inline-flex min-h-[3.5rem] w-full max-w-full items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold px-6 py-3 text-center text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 whitespace-normal"
                >
                  <span className="text-balance">{isPreview ? "Próximamente" : "Agregar al carrito"}</span>
                </button>
                <p className="mobile-safe-copy text-sm leading-7 text-white/60">{helperMessage}</p>
              </div>

              <details className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/68">
                <summary className="cursor-pointer list-none text-sm font-medium text-white/82">Detalles del producto</summary>
                <div className="mt-4 space-y-3 leading-7">
                  <p>{product.description}</p>
                  {selectedVariant ? (
                    <p>
                      Variante actual: {selectedVariant.name}
                      {selectedVariant.color ? ` • ${selectedVariant.color}` : ""}
                      {selectedVariant.size ? ` • ${selectedVariant.size}` : ""}
                    </p>
                  ) : null}
                  {!isPreview ? <p>Las imagenes y variantes provienen del catalogo real sincronizado con Printful.</p> : null}
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      <StoreProductLightbox
        open={zoomOpen}
        images={galleryImages}
        activeUrl={activeImageUrl}
        alt={product.name}
        onClose={() => setZoomOpen(false)}
        onSelect={setActiveImageUrl}
      />
    </>
  );
}
