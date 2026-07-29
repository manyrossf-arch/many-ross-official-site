import type { StoreCatalogResponse, StoreProduct } from "@/types/store";

const DEMO_REVALIDATE_SECONDS = 120;

const demoFrontImage = {
  url: "/images/titanio-y-salitre-tee.png",
  label: "Vista frontal",
  role: "front",
} as const;

const demoCapImage = {
  url: "/images/nivel-leyenda-cap.png",
  label: "Vista frontal",
  role: "front",
} as const;

export const demoStoreProducts: StoreProduct[] = [
  {
    id: "demo-tee",
    externalId: null,
    name: "Titanio y Salitre Tee",
    description:
      "Una pieza nacida del golpe, la transformacion y la identidad. Merch visual para una historia que no se quiebra.",
    imageUrl: "/images/titanio-y-salitre-tee.png",
    images: [demoFrontImage],
    imageDebug: "Demo visual sin mockups reales de Printful.",
    hasRealMockup: false,
    price: 54,
    currency: "USD",
    badges: ["Edicion Limitada"],
    availability: "active",
    variantCount: 2,
    variants: [
      {
        id: "demo-tee-black-l",
        name: "Negro / L",
        sku: null,
        size: "L",
        color: "Negro",
        price: 54,
        currency: "USD",
        availability: "active",
        imageUrl: "/images/titanio-y-salitre-tee.png",
        images: [demoFrontImage],
        imageDebug: "Demo visual sin mockups reales de Printful.",
      },
      {
        id: "demo-tee-black-xl",
        name: "Negro / XL",
        sku: null,
        size: "XL",
        color: "Negro",
        price: 54,
        currency: "USD",
        availability: "active",
        imageUrl: "/images/titanio-y-salitre-tee.png",
        images: [demoFrontImage],
        imageDebug: "Demo visual sin mockups reales de Printful.",
      },
    ],
    source: "demo",
  },
  {
    id: "demo-cap",
    externalId: null,
    name: "Nivel Leyenda Cap",
    description:
      "Una gorra para llevar cicatrices convertidas en vision. Identidad urbana con presencia de escenario internacional.",
    imageUrl: "/images/nivel-leyenda-cap.png",
    images: [demoCapImage],
    imageDebug: "Demo visual sin mockups reales de Printful.",
    hasRealMockup: false,
    price: 42,
    currency: "USD",
    badges: ["Drop Exclusivo"],
    availability: "active",
    variantCount: 1,
    variants: [
      {
        id: "demo-cap-black",
        name: "Negro / Ajustable",
        sku: null,
        size: "Ajustable",
        color: "Negro",
        price: 42,
        currency: "USD",
        availability: "active",
        imageUrl: "/images/nivel-leyenda-cap.png",
        images: [demoCapImage],
        imageDebug: "Demo visual sin mockups reales de Printful.",
      },
    ],
    source: "demo",
  },
];

export function getDemoStoreCatalog(message?: string): StoreCatalogResponse {
  return {
    source: "demo",
    products: demoStoreProducts,
    meta: {
      source: "demo",
      count: demoStoreProducts.length,
      fetchedAt: new Date().toISOString(),
      revalidateSeconds: DEMO_REVALIDATE_SECONDS,
      fallbackReason: "missing_token",
      message:
        message ||
        "Mostrando el catalogo visual de demostracion mientras se configura el token privado de Printful.",
    },
  };
}
