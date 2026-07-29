import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StoreProductDetailView } from "@/components/cart/store-product-detail-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteConfig } from "@/lib/site-config";
import { getStoreProductById, STORE_REVALIDATE_SECONDS } from "@/lib/store-catalog";

export const revalidate = 120;

type ProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const result = await getStoreProductById(productId);

  if (!result.product) {
    return {
      title: "Producto no disponible",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: result.product.name,
    description: result.product.description,
    openGraph: {
      title: `${result.product.name} | Many Ross`,
      description: result.product.description,
      url: `${siteConfig.siteUrl}/store/${productId}`,
      images: [
        {
          url: result.product.imageUrl,
          alt: result.product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const result = await getStoreProductById(productId);

  if (!result.product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <StoreProductDetailView product={result.product} />
        {result.source !== "printful" ? (
          <section className="section-shell pb-16">
            <div className="glass-panel rounded-[30px] border border-white/10 p-6 text-sm leading-7 text-white/68">
              {result.source === "demo" ? (
                <p>Esta vista pertenece a una pieza editorial de demostracion. El flujo de compra real sigue reservado para productos sincronizados desde Printful.</p>
              ) : (
                <p>Este producto no pudo cargarse desde el catalogo real en este entorno.</p>
              )}
              <div className="mt-4">
                <Link href="/#tienda" className="inline-flex min-h-[3rem] items-center justify-center rounded-full border border-gold/25 bg-gold/10 px-5 py-3 text-sm text-gold transition hover:bg-gold/20">
                  Volver a la tienda
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}
