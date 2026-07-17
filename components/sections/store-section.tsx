import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/lib/site-config";
import { merchItems, phrases, storeCategories } from "@/lib/site-data";

export function StoreSection() {
  return (
    <section id="tienda" className="section-shell space-y-12 py-24">
      <FadeIn className="section-heading">
        <p className="eyebrow">Tienda + Printful</p>
        <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
          Merch premium con narrativa, categorias y frases listas para vender.
        </h2>
        <p className="text-lg leading-8 text-white/60">
          La tienda esta planteada para conectar despues con Printful, catalogo real, checkout y colecciones que sostengan la identidad de Many Ross.
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

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6 md:grid-cols-2">
          {merchItems.map((item, index) => (
            <FadeIn key={item.title} delay={0.12 + index * 0.08}>
              <article className="glass-panel group overflow-hidden rounded-[34px]">
                <div className="relative aspect-[5/6] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-5 top-5 rounded-full border border-gold/30 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold">
                    {item.tag}
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl uppercase tracking-[0.12em] text-ivory">{item.title}</h3>
                    <span className="text-sm font-semibold text-gold">{item.price}</span>
                  </div>
                  <ExternalLink href={siteConfig.links.merchDrop} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-white/68 transition hover:text-gold">
                    Ver coleccion
                    <ArrowUpRight className="h-4 w-4" />
                  </ExternalLink>
                </div>
              </article>
            </FadeIn>
          ))}
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

