"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowUpRight, LoaderCircle, RefreshCcw, Sparkles } from "lucide-react";
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

type FilterSource = "all" | "printful" | "demo";

type ActiveFilters = {
  color: string;
  size: string;
  source: FilterSource;
};

const initialState: StoreState = {
  status: "loading",
  data: null,
  error: null,
};

const defaultFilters: ActiveFilters = {
  color: "all",
  size: "all",
  source: "all",
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

function uniqueValues(values: Array<string | null>, limit = 4) {
  return Array.from(new Set(values.filter(Boolean) as string[])).slice(0, limit);
}

function matchesFilters(product: StoreProduct, filters: ActiveFilters) {
  const colors = uniqueValues(product.variants.map((variant) => variant.color), 99);
  const sizes = uniqueValues(product.variants.map((variant) => variant.size), 99);

  const matchesColor = filters.color === "all" || colors.includes(filters.color);
  const matchesSize = filters.size === "all" || sizes.includes(filters.size);
  const matchesSource = filters.source === "all" || product.source === filters.source;

  return matchesColor && matchesSize && matchesSource;
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active
        ? "rounded-full border border-gold/30 bg-gold px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-black transition"
        : "rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/64 transition hover:border-gold/20 hover:text-gold"}
    >
      {label}
    </button>
  );
}

function ProductSpotlight({ product }: { product: StoreProduct }) {
  const hasStoreLink = Boolean(siteConfig.links.merchDrop);
  const colors = uniqueValues(product.variants.map((variant) => variant.color));
  const sizes = uniqueValues(product.variants.map((variant) => variant.size), 6);
  const sourceCopy = product.source === "printful" ? "Printful API" : "Demo visual";

  return (
    <div className="glass-panel relative overflow-hidden rounded-[40px] border border-gold/20 p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,75,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(94,13,19,0.22),transparent_30%)]" />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-gold">
              Pieza destacada
            </span>
            <span className="rounded-full border border-white/12 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/72">
              {sourceCopy}
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/46">Nivel Leyenda Collection</p>
            <h3 className="font-display text-4xl uppercase tracking-[0.1em] text-ivory sm:text-5xl xl:text-6xl">
              {product.name}
            </h3>
            <p className="max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
              {product.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/46">Precio</p>
              <p className="mt-2 text-lg font-semibold text-gold">{formatPrice(product.price, product.currency)}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/46">Estado</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/78">{availabilityCopy(product)}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/46">Variantes</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/78">{product.variantCount} activas</p>
            </div>
          </div>

          {colors.length > 0 ? (
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/46">Paleta disponible</p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/62">
                {colors.map((color) => (
                  <span key={color} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-2">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {sizes.length > 0 ? (
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/46">Tallas clave</p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                {sizes.map((size) => (
                  <span key={size} className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {hasStoreLink ? (
              <ExternalLink
                href={siteConfig.links.merchDrop}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.26em] text-black transition hover:brightness-110"
              >
                Ver coleccion oficial
                <ArrowUpRight className="h-4 w-4" />
              </ExternalLink>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-6 py-3 text-xs uppercase tracking-[0.24em] text-gold">
                Checkout en siguiente fase
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-xs uppercase tracking-[0.22em] text-white/64">
              <Sparkles className="h-4 w-4 text-gold" />
              Editorial drop de artista
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.22),transparent_55%)] blur-2xl" />
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black/40">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_50%,rgba(0,0,0,0.58)_100%)]" />
            <div className="relative aspect-[4/5] min-h-[420px] sm:min-h-[540px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
                unoptimized={product.imageUrl.startsWith("http")}
              />
            </div>
            <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/52">Many Ross Official Storefront</p>
                <p className="mt-2 text-lg uppercase tracking-[0.18em] text-ivory">{product.badges[0] || "Seleccion curada"}</p>
              </div>
              <span className="rounded-full border border-white/12 bg-black/40 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/72 backdrop-blur-sm">
                {sourceCopy}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const hasStoreLink = Boolean(siteConfig.links.merchDrop);
  const colors = uniqueValues(product.variants.map((variant) => variant.color));
  const sizes = uniqueValues(product.variants.map((variant) => variant.size), 5);
  const previewImages = uniqueValues(product.variants.map((variant) => variant.imageUrl), 3);

  return (
    <article className="glass-panel group overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]">
      <div className="relative aspect-[5/6] overflow-hidden bg-black/40">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          unoptimized={product.imageUrl.startsWith("http")}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(8,8,8,0.12)_35%,rgba(7,7,7,0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-28 bg-[radial-gradient(circle_at_bottom,rgba(201,162,75,0.18),transparent_62%)]" />

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-gold/30 bg-black/50 px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-gold backdrop-blur-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="absolute right-5 top-5 rounded-full border border-white/12 bg-black/45 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/76 backdrop-blur-sm">
          {product.source === "printful" ? "Catalogo real" : "Demo visual"}
        </div>

        <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/58">Mockup principal</p>
            <h3 className="mt-2 font-display text-2xl uppercase tracking-[0.12em] text-ivory sm:text-3xl">
              {product.name}
            </h3>
          </div>
          <span className="rounded-full border border-gold/25 bg-black/48 px-4 py-2 text-sm font-semibold text-gold backdrop-blur-sm">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <p className="text-sm leading-7 text-white/66">{product.description}</p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/46">Estado</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/78">{availabilityCopy(product)}</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/46">Variantes</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/78">{product.variantCount} activas</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/46">Origen</p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/78">
              {product.source === "printful" ? "Printful API" : "Catalogo demo"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {colors.length > 0 ? (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/46">Colores</p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/62">
                {colors.map((color) => (
                  <span key={color} className="rounded-full border border-white/12 px-3 py-2">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {sizes.length > 0 ? (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/46">Tallas</p>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-white/62">
                {sizes.map((size) => (
                  <span key={size} className="rounded-full border border-gold/18 bg-gold/8 px-3 py-2 text-gold">
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {previewImages.length > 0 ? (
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/46">Vista de mockups</p>
            <div className="grid grid-cols-3 gap-3">
              {previewImages.map((imageUrl, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03]"
                >
                  <Image
                    src={imageUrl}
                    alt={`${product.name} variante ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                    unoptimized={imageUrl.startsWith("http")}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

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

  const colorOptions = useMemo(
    () => uniqueValues(products.flatMap((product) => product.variants.map((variant) => variant.color)), 99),
    [products],
  );

  const sizeOptions = useMemo(
    () => uniqueValues(products.flatMap((product) => product.variants.map((variant) => variant.size)), 99),
    [products],
  );

  const filteredProducts = useMemo(
    () => products.filter((product) => matchesFilters(product, filters)),
    [products, filters],
  );

  const featuredProduct = filteredProducts[0] ?? null;
  const remainingProducts = filteredProducts.slice(1);
  const isDemo = storeState.data?.source === "demo";
  const isEmpty = storeState.status === "ready" && !isDemo && products.length === 0;
  const hasFilteredResults = filteredProducts.length > 0;
  const hasActiveFilters =
    filters.color !== "all" || filters.size !== "all" || filters.source !== "all";

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

      {storeState.status === "ready" && products.length > 0 ? (
        <FadeIn delay={0.11}>
          <div className="glass-panel rounded-[34px] border border-white/10 p-6 sm:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="eyebrow">Filtros visuales</p>
                  <h3 className="font-display text-2xl uppercase tracking-[0.12em] text-ivory sm:text-3xl">
                    Curar el drop por color, talla y origen
                  </h3>
                </div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/54">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "pieza visible" : "piezas visibles"}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/46">Origen</p>
                  <div className="flex flex-wrap gap-2">
                    <FilterChip
                      active={filters.source === "all"}
                      label="Todos"
                      onClick={() => setFilters((current) => ({ ...current, source: "all" }))}
                    />
                    <FilterChip
                      active={filters.source === "printful"}
                      label="Printful API"
                      onClick={() => setFilters((current) => ({ ...current, source: "printful" }))}
                    />
                    <FilterChip
                      active={filters.source === "demo"}
                      label="Demo visual"
                      onClick={() => setFilters((current) => ({ ...current, source: "demo" }))}
                    />
                  </div>
                </div>

                {colorOptions.length > 0 ? (
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/46">Color</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip
                        active={filters.color === "all"}
                        label="Todos"
                        onClick={() => setFilters((current) => ({ ...current, color: "all" }))}
                      />
                      {colorOptions.map((color) => (
                        <FilterChip
                          key={color}
                          active={filters.color === color}
                          label={color}
                          onClick={() => setFilters((current) => ({ ...current, color }))}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}

                {sizeOptions.length > 0 ? (
                  <div>
                    <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/46">Talla</p>
                    <div className="flex flex-wrap gap-2">
                      <FilterChip
                        active={filters.size === "all"}
                        label="Todas"
                        onClick={() => setFilters((current) => ({ ...current, size: "all" }))}
                      />
                      {sizeOptions.map((size) => (
                        <FilterChip
                          key={size}
                          active={filters.size === size}
                          label={size}
                          onClick={() => setFilters((current) => ({ ...current, size }))}
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {hasActiveFilters ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/42">Filtros activos</span>
                  {filters.source !== "all" ? (
                    <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-gold">
                      {filters.source === "printful" ? "Printful API" : "Demo visual"}
                    </span>
                  ) : null}
                  {filters.color !== "all" ? (
                    <span className="rounded-full border border-white/12 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/72">
                      {filters.color}
                    </span>
                  ) : null}
                  {filters.size !== "all" ? (
                    <span className="rounded-full border border-white/12 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/72">
                      {filters.size}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setFilters(defaultFilters)}
                    className="rounded-full border border-white/12 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-white/54 transition hover:border-gold/20 hover:text-gold"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </FadeIn>
      ) : null}

      {storeState.status === "ready" && featuredProduct ? (
        <FadeIn delay={0.12}>
          <ProductSpotlight product={featuredProduct} />
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

          {storeState.status === "ready" && products.length > 0 && !hasFilteredResults ? (
            <FadeIn>
              <div className="glass-panel rounded-[34px] p-8 text-center">
                <p className="font-display text-2xl uppercase tracking-[0.12em] text-ivory">
                  Ninguna pieza coincide con estos filtros
                </p>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  Prueba otra combinacion de color, talla u origen para volver a expandir el drop.
                </p>
                <button
                  type="button"
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-5 rounded-full border border-gold/20 bg-gold/10 px-5 py-3 text-xs uppercase tracking-[0.26em] text-gold transition hover:bg-gold/20"
                >
                  Limpiar filtros
                </button>
              </div>
            </FadeIn>
          ) : null}

          {storeState.status === "ready" && remainingProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {remainingProducts.map((product, index) => (
                <FadeIn key={product.id} delay={0.14 + index * 0.08}>
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
