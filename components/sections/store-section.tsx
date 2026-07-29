"use client";

import { AlertCircle, LoaderCircle, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { StoreProductDisplay } from "@/components/cart/store-product-display";
import { FadeIn } from "@/components/motion/fade-in";
import { demoStoreProducts } from "@/lib/demo-store";
import { phrases, storeCategories } from "@/lib/site-data";
import type { StoreApiErrorResponse, StoreCatalogResponse } from "@/types/store";

type StoreState = {
  status: "loading" | "ready" | "error";
  data: StoreCatalogResponse | null;
  error: StoreApiErrorResponse["error"] | null;
};

type ActiveFilters = {
  color: string;
  size: string;
};

const initialState: StoreState = {
  status: "loading",
  data: null,
  error: null,
};

const defaultFilters: ActiveFilters = {
  color: "all",
  size: "all",
};

function uniqueValues(values: Array<string | null>, limit = 99) {
  return Array.from(new Set(values.filter(Boolean) as string[])).slice(0, limit);
}

function matchesFilters(
  product: StoreCatalogResponse["products"][number],
  filters: ActiveFilters,
) {
  const colors = uniqueValues(product.variants.map((variant) => variant.color));
  const sizes = uniqueValues(product.variants.map((variant) => variant.size));

  const matchesColor = filters.color === "all" || colors.includes(filters.color);
  const matchesSize = filters.size === "all" || sizes.includes(filters.size);

  return matchesColor && matchesSize;
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active
        ? "rounded-full border border-gold/30 bg-gold px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-black compact-eyebrow"
        : "rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/64 transition hover:border-gold/20 hover:text-gold compact-eyebrow"}
    >
      <span className="text-balance">{label}</span>
    </button>
  );
}

export function StoreSection() {
  const [storeState, setStoreState] = useState<StoreState>(initialState);
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);

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
        setStoreState({ status: "error", data: null, error: errorPayload.error });
        return;
      }

      const payload = (await response.json()) as StoreCatalogResponse;
      setStoreState({ status: "ready", data: payload, error: null });
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
          message: "No fue posible cargar el catalogo real desde el navegador. Intenta de nuevo.",
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
  const colorOptions = useMemo(() => uniqueValues(products.flatMap((product) => product.variants.map((variant) => variant.color))), [products]);
  const sizeOptions = useMemo(() => uniqueValues(products.flatMap((product) => product.variants.map((variant) => variant.size))), [products]);
  const filteredProducts = useMemo(() => products.filter((product) => matchesFilters(product, filters)), [products, filters]);

  const featuredProduct = filteredProducts[0] ?? null;
  const remainingProducts = filteredProducts.slice(1);
  const isEmpty = storeState.status === "ready" && products.length === 0;
  const hasFilteredResults = filteredProducts.length > 0;
  const hasActiveFilters = filters.color !== "all" || filters.size !== "all";

  return (
    <section id="tienda" className="section-shell space-y-12 py-24">
      <FadeIn className="section-heading min-w-0">
        <p className="eyebrow">Tienda oficial</p>
        <h2 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
          Descubre la coleccion oficial de Many Ross Universo.
        </h2>
        <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/60">
          Explora cada prenda, abre su vista detallada y elige tu color y talla con una experiencia clara, premium y enfocada en compra.
        </p>
      </FadeIn>

      <FadeIn delay={0.08} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {storeCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="glass-panel flex min-w-0 items-center gap-3 rounded-[28px] p-5">
              <div className="rounded-2xl border border-gold/20 bg-gold/10 p-3 shrink-0">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <p className="text-balance text-sm uppercase tracking-[0.14em] text-white/72 compact-tracking">{category.title}</p>
            </div>
          );
        })}
      </FadeIn>

      {storeState.status === "ready" && storeState.data?.meta.message && storeState.data.source !== "printful" ? (
        <FadeIn delay={0.1}>
          <div className="mobile-safe-copy rounded-[28px] border border-gold/18 bg-gold/10 px-5 py-4 text-sm leading-7 text-white/76">
            {storeState.data.meta.message}
          </div>
        </FadeIn>
      ) : null}

      {storeState.status === "ready" && products.length > 0 ? (
        <FadeIn delay={0.11}>
          <div className="glass-panel rounded-[34px] border border-white/10 p-6 sm:p-8">
            <div className="flex min-w-0 flex-col gap-6">
              <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0">
                  <p className="eyebrow">Filtra tu drop</p>
                  <h3 className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                    Encuentra tu pieza por color y talla
                  </h3>
                </div>
                <p className="text-sm uppercase tracking-[0.14em] text-white/54 compact-tracking text-balance">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "pieza visible" : "piezas visibles"}
                </p>
              </div>

              <div className="space-y-5 min-w-0">
                {colorOptions.length > 0 ? (
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Color</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip label="Todos" active={filters.color === "all"} onClick={() => setFilters((current) => ({ ...current, color: "all" }))} />
                      {colorOptions.map((color) => (
                        <FilterChip key={color} label={color} active={filters.color === color} onClick={() => setFilters((current) => ({ ...current, color }))} />
                      ))}
                    </div>
                  </div>
                ) : null}

                {sizeOptions.length > 0 ? (
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.16em] text-white/46 compact-eyebrow">Talla</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip label="Todas" active={filters.size === "all"} onClick={() => setFilters((current) => ({ ...current, size: "all" }))} />
                      {sizeOptions.map((size) => (
                        <FilterChip key={size} label={size} active={filters.size === size} onClick={() => setFilters((current) => ({ ...current, size }))} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-3 min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-white/42 compact-eyebrow">Filtros activos</span>
                  <button
                    type="button"
                    onClick={() => setFilters(defaultFilters)}
                    className="rounded-full border border-white/12 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/54 transition hover:border-gold/20 hover:text-gold compact-eyebrow whitespace-normal"
                  >
                    <span className="text-balance">Limpiar filtros</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </FadeIn>
      ) : null}

      {storeState.status === "ready" && featuredProduct ? (
        <FadeIn delay={0.12}>
          <StoreProductDisplay product={featuredProduct} featured />
        </FadeIn>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 min-w-0">
          {storeState.status === "loading" ? (
            <div className="glass-panel rounded-[34px] p-8 text-center">
              <LoaderCircle className="mx-auto mb-4 h-8 w-8 animate-spin text-gold" />
              <p className="text-sm text-white/60">Cargando la coleccion oficial...</p>
            </div>
          ) : null}

          {storeState.status === "error" && storeState.error ? (
            <FadeIn>
              <div className="glass-panel rounded-[34px] border border-[#5E0D13]/40 p-6">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="rounded-2xl border border-[#5E0D13]/40 bg-[#5E0D13]/20 p-3 shrink-0">
                    <AlertCircle className="h-5 w-5 text-[#ff8b8b]" />
                  </div>
                  <div className="min-w-0 space-y-3">
                    <p className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                      Catalogo real temporalmente no disponible
                    </p>
                    <p className="mobile-safe-copy text-sm leading-7 text-white/68">{storeState.error.message}</p>
                    <button type="button" onClick={() => void loadCatalog()} className="inline-flex min-h-[3rem] max-w-full items-center gap-2 rounded-full border border-gold/30 px-5 py-3 text-center text-xs uppercase tracking-[0.16em] text-gold transition hover:bg-gold/10 whitespace-normal compact-tracking">
                      <RefreshCcw className="h-4 w-4 shrink-0" />
                      <span className="text-balance">Reintentar</span>
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ) : null}

          {isEmpty ? (
            <FadeIn>
              <div className="glass-panel rounded-[34px] p-8 text-center min-w-0">
                <LoaderCircle className="mx-auto mb-4 h-8 w-8 text-gold" />
                <p className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                  El catalogo esta conectado, pero aun no tiene productos visibles
                </p>
                <p className="mobile-safe-copy mt-3 text-sm leading-7 text-white/64">
                  Publica al menos un producto con variantes y mockups en tu tienda Manual order / API de Printful para verlo aqui.
                </p>
              </div>
            </FadeIn>
          ) : null}

          {storeState.status === "ready" && products.length > 0 && !hasFilteredResults ? (
            <FadeIn>
              <div className="glass-panel rounded-[34px] p-8 text-center min-w-0">
                <p className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                  Ninguna pieza coincide con estos filtros
                </p>
                <p className="mobile-safe-copy mt-3 text-sm leading-7 text-white/64">
                  Prueba otra combinacion de color o talla para volver a expandir el drop.
                </p>
              </div>
            </FadeIn>
          ) : null}

          {storeState.status === "ready" && remainingProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {remainingProducts.map((product, index) => (
                <FadeIn key={product.id} delay={0.14 + index * 0.08}>
                  <StoreProductDisplay product={product} />
                </FadeIn>
              ))}
            </div>
          ) : null}

          <FadeIn delay={0.24}>
            <div className="glass-panel rounded-[34px] border border-white/10 p-6 sm:p-8">
              <div className="space-y-3">
                <p className="eyebrow">Vista previa editorial</p>
                <h3 className="mobile-safe-title fluid-card-title compact-tracking font-display uppercase text-ivory">
                  Mockups demo sin compra habilitada
                </h3>
                <p className="mobile-safe-copy text-sm leading-7 text-white/64">
                  Estas tarjetas fueron las que antes alimentaban el flujo demo. Ahora quedan separadas como referencia visual y nunca construyen variantes comprables ni llegan al carrito.
                </p>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {demoStoreProducts.map((product, index) => (
                  <FadeIn key={product.id} delay={0.26 + index * 0.08}>
                    <StoreProductDisplay product={product} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="glass-panel h-full rounded-[36px] p-8 min-w-0">
            <p className="eyebrow">Coleccion especial de frases</p>
            <div className="mt-6 space-y-4 min-w-0">
              {phrases.map((phrase) => (
                <div key={phrase} className="mobile-safe-copy rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 text-base leading-7 text-white/82">
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
