"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, LoaderCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/lib/site-config";
import { phrases, storeCategories } from "@/lib/site-data";
import type { StoreApiErrorResponse, StoreCatalogResponse, StoreProduct } from "@/types/store";

type StoreState = {
  status: "loading" | "ready" | "error";
  data: StoreCatalogResponse | null;
  error: StoreApiErrorResponse["error"] | null;
};

const initialState: StoreState = {
  status: "loading",
  data: null,
  error: null,
};

function formatPrice(price: number | null, currency: string | null) {
  if (price === null) {
    return "Precio en configuracion";
  }

  return new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

function availabilityCopy(product: StoreProduct) {
  switch (product.availability) {
    case "active":
      return "Disponible en catalogo";
    case "draft":
      return "Variantes preparadas";
    case "archived":
      return "Pieza archivada";
    default:
      return "Estado en revision";
  }
}

function ProductCard({ product }: { product: StoreProduct }) {
  const variantPreview = product.variants.slice(0, 3);
  const hasStoreLink = Boolean(siteConfig.links.merchDrop);

  return (
    <article className="glass-panel group overflow-hidden rounded-[34px]">
      <div className="relative aspect-[5/6] overflow-hidden bg-black/40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-105"
          unoptimized={product.imageUrl.startsWith("http")}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_38%,rgba(7,7,7,0.68)_100%)]" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-gold/30 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-display text-2xl uppercase tracking-[0.12em] text-ivory">{product.name}</h3>
            <p className="text-sm leading-7 text-white/66">{product.description}</p>
          </div>
          <span className="whitespace-nowrap text-sm font-semibold text-gold">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/56">
          <span className="rounded-full border border-white/12 px-3 py-2">{availabilityCopy(product)}</span>
          <span className="rounded-full border border-white/12 px-3 py-2">{product.variantCount} variantes</span>
          {variantPreview.map((variant) => (
            <span key={variant.id} className="rounded-full border border-white/12 px-3 py-2">
              {variant.color || variant.size || variant.name}
            </span>
          ))}
        </div>

        {hasStoreLink ? (
          <ExternalLink
            href={siteConfig.links.merchDrop}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-white/68 transition hover:text-gold"
          >
            Ver coleccion oficial
            <ArrowUpRight className="h-4 w-4" />
          </ExternalLink>
        ) : (
          <p className="text-sm uppercase tracking-[0.24em] text-white/46">
            Catalogo conectado. Checkout y compra directa se activaran en la siguiente fase.
          </p>
        )}
      </div>
    </article>
  );
}

function ProductSkeleton() {
  return (
    <div className="glass-panel overflow-hidden rounded-[34px]">
      <div className="aspect-[5/6] animate-pulse bg-white/[0.05]" />
      <div className="space-y-3 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="h-4 w-full animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-white/[0.05]" />
        <div className="h-10 w-1/2 animate-pulse rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );
}

export function StoreSection() {
  const [storeState, setStoreState] = useState<StoreState>(initialState);

  const loadCatalog = useCallback(async (signal?: AbortSignal) => {
    setStoreState((current) => ({ ...current, status: "loading", error: null }));

    try {
      const response = await fetch("/api/store/products", {
        method: "GET",
        cache: "no-store",
        signal,
      });

      if (!response.ok) {
        const errorPayload = (await response.json()) as StoreApiErrorResponse;
        setStoreState({
          status: "error",
          data: null,
          error: errorPayload.error,
        });
        return;
      }

      const payload = (await response.json()) as StoreCatalogResponse;
      setStoreState({
        status: "ready",
        data: payload,
        error: null,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setStoreState({
        status: "error",
        data: null,
        error: {
          code: "PRINTFUL_NETWORK_ERROR",
          status: 502,
          message: "No fue posible cargar el catalogo desde el navegador. Intenta de nuevo.",
          retryable: true,
        },
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadCatalog(controller.signal);
    return () => controller.abort();
  }, [loadCatalog]);

  const products = useMemo(() => storeState.data?.products ?? [], [storeState.data]);
  const isDemo = storeState.data?.source === "demo";
  const isEmpty = storeState.status === "ready" && !isDemo && products.length === 0;

  return (
    <section id="tienda" className="section-shell space-y-12 py-24">
      <FadeIn className="section-heading">
        <p className="eyebrow">Tienda + Printful API</p>
        <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
          Merch premium con catalogo visual listo para convertirse en tienda oficial.
        </h2>
        <p className="text-lg leading-8 text-white/60">
          Esta seccion ya puede leer productos reales desde Printful con seguridad server-side, pero conserva el demo visual mientras terminas de poblar tu tienda API.
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {storeCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="glass-panel rounded-[28px] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/72">{category.title}</p>
              </div>
            </div>
          );
        })}
      </FadeIn>

      {storeState.status === "ready" && storeState.data?.meta.message ? (
        <FadeIn delay={0.1}>
          <div className="rounded-[28px] border border-gold/18 bg-gold/10 px-5 py-4 text-sm leading-7 text-white/76">
            {storeState.data.meta.message}
          </div>
        </FadeIn>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {storeState.status === "loading" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <ProductSkeleton />
              <ProductSkeleton />
            </div>
          ) : null}

          {storeState.status === "error" && storeState.error ? (
            <FadeIn>
              <div className="glass-panel rounded-[34px] border border-[#5E0D13]/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-[#5E0D13]/40 bg-[#5E0D13]/20 p-3">
                    <AlertCircle className="h-5 w-5 text-[#ff8b8b]" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-display text-2xl uppercase tracking-[0.12em] text-ivory">
                      No se pudo cargar el catalogo real
                    </p>
                    <p className="text-sm leading-7 text-white/68">{storeState.error.message}</p>
                    <button
                      type="button"
                      onClick={() => void loadCatalog()}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-xs uppercase tracking-[0.26em] text-gold transition hover:bg-gold/10"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ) : null}

          {isEmpty ? (
            <FadeIn>
              <div className="glass-panel rounded-[34px] p-8 text-center">
                <LoaderCircle className="mx-auto mb-4 h-8 w-8 text-gold" />
                <p className="font-display text-2xl uppercase tracking-[0.12em] text-ivory">
                  El catalogo esta conectado, pero aun no tiene productos visibles
                </p>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  Publica al menos un producto con variantes y mockups en tu tienda Manual order / API de Printful para verlo aqui.
                </p>
              </div>
            </FadeIn>
          ) : null}

          {storeState.status === "ready" && products.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product, index) => (
                <FadeIn key={product.id} delay={0.12 + index * 0.08}>
                  <ProductCard product={product} />
                </FadeIn>
              ))}
            </div>
          ) : null}
        </div>

        <FadeIn delay={0.2}>
          <div className="glass-panel h-full rounded-[36px] p-8">
            <p className="eyebrow">Coleccion especial de frases</p>
            <div className="mt-6 space-y-4">
              {phrases.map((phrase) => (
                <div
                  key={phrase}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-base leading-7 text-white/82"
                >
                  &quot;{phrase}&quot;
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
