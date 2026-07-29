"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { StoreProductImage } from "@/types/store";

const PLACEHOLDER_IMAGE = "/images/mockup-placeholder.svg";

export function StoreProductImageFrame({
  image,
  alt,
  featured = false,
  priority = false,
  onClick,
}: {
  image: string;
  alt: string;
  featured?: boolean;
  priority?: boolean;
  onClick?: () => void;
}) {
  const [resolvedImage, setResolvedImage] = useState(image || PLACEHOLDER_IMAGE);

  useEffect(() => {
    setResolvedImage(image || PLACEHOLDER_IMAGE);
  }, [image]);

  const frameInner = (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,75,0.16),transparent_42%)]" />
      <div className={featured ? "relative aspect-[4/5] min-h-[320px] w-full p-4 sm:min-h-[420px] sm:p-6" : "relative aspect-[4/5] min-h-[280px] w-full p-4 sm:min-h-[320px] sm:p-5"}>
        <Image
          src={resolvedImage}
          alt={alt}
          fill
          priority={priority}
          sizes={featured ? "(max-width: 1024px) 100vw, 52vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-contain object-center p-2 sm:p-3"
          unoptimized={resolvedImage.startsWith("http")}
          onError={() => setResolvedImage(PLACEHOLDER_IMAGE)}
        />
      </div>
    </>
  );

  if (!onClick) {
    return <div className="relative w-full overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#f6f1e6_0%,#efe7da_100%)]">{frameInner}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#f6f1e6_0%,#efe7da_100%)] text-left transition hover:border-gold/30",
      )}
      aria-label={`Ampliar imagen de ${alt}`}
    >
      {frameInner}
    </button>
  );
}

export function StoreProductGallery({
  images,
  activeUrl,
  onSelect,
}: {
  images: StoreProductImage[];
  activeUrl: string;
  onSelect: (url: string) => void;
}) {
  if (images.length <= 1) {
    return null;
  }

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-max gap-3">
        {images.map((image) => {
          const active = image.url === activeUrl;
          return (
            <button
              key={`${image.url}-${image.label}`}
              type="button"
              onClick={() => onSelect(image.url)}
              className={active
                ? "min-h-11 min-w-11 rounded-[18px] border border-gold/40 bg-gold/10 p-2"
                : "min-h-11 min-w-11 rounded-[18px] border border-white/10 bg-white/[0.03] p-2 transition hover:border-gold/20"}
              aria-label={`Ver ${image.label}`}
              title={image.label}
            >
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-[12px] bg-[#f5f2eb] p-2 sm:h-[84px] sm:w-[84px]">
                <Image src={image.url} alt={image.label} fill sizes="84px" className="object-contain p-1" unoptimized={image.url.startsWith("http")} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StoreProductLightbox({
  open,
  images,
  activeUrl,
  alt,
  onClose,
  onSelect,
}: {
  open: boolean;
  images: StoreProductImage[];
  activeUrl: string;
  alt: string;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const activeIndex = useMemo(() => Math.max(0, images.findIndex((image) => image.url === activeUrl)), [activeUrl, images]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault();
        const nextImage = images[(activeIndex + 1) % images.length];
        if (nextImage) {
          onSelect(nextImage.url);
        }
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault();
        const previousImage = images[(activeIndex - 1 + images.length) % images.length];
        if (previousImage) {
          onSelect(previousImage.url);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images, onClose, onSelect, open]);

  if (!open) {
    return null;
  }

  const goPrevious = () => {
    if (images.length <= 1) {
      return;
    }

    const previousImage = images[(activeIndex - 1 + images.length) % images.length];
    if (previousImage) {
      onSelect(previousImage.url);
    }
  };

  const goNext = () => {
    if (images.length <= 1) {
      return;
    }

    const nextImage = images[(activeIndex + 1) % images.length];
    if (nextImage) {
      onSelect(nextImage.url);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/88 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria ampliada de ${alt}`}
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl rounded-[32px] border border-white/10 bg-[#0f0f0f] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="min-w-0 text-sm text-white/70">{images[activeIndex]?.label || alt}</p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition hover:border-gold/30 hover:text-gold"
            aria-label="Cerrar galeria"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#f6f1e6_0%,#efe7da_100%)]">
          <div className="relative aspect-[4/5] min-h-[60vh] w-full p-4 sm:min-h-[72vh] sm:p-6">
            <Image
              src={activeUrl || PLACEHOLDER_IMAGE}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain object-center p-2 sm:p-3"
              unoptimized={(activeUrl || PLACEHOLDER_IMAGE).startsWith("http")}
            />
          </div>

          {images.length > 1 ? (
            <>
              <button type="button" onClick={goPrevious} className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white transition hover:border-gold/30 hover:text-gold" aria-label="Imagen anterior">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={goNext} className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white transition hover:border-gold/30 hover:text-gold" aria-label="Imagen siguiente">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
        </div>

        <div className="mt-4">
          <StoreProductGallery images={images} activeUrl={activeUrl} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}