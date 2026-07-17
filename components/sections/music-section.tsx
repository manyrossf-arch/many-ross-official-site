import { Disc3, Film, RadioTower } from "lucide-react";
import Image from "next/image";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { releases } from "@/lib/site-data";

export function MusicSection() {
  const chips = [
    { label: "Lanzamientos", icon: Disc3 },
    { label: "Albumes", icon: RadioTower },
    { label: "Sencillos", icon: Disc3 },
    { label: "Videos", icon: Film },
  ];

  return (
    <section id="musica" className="section-shell space-y-10 py-24">
      <FadeIn className="section-heading">
        <p className="eyebrow">Escucha mi musica</p>
        <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
          Catalogo disenado para vivirse como una experiencia editorial premium.
        </h2>
        <p className="text-lg leading-8 text-white/60">
          Spotify, Apple Music y YouTube ya quedaron conectados con los enlaces oficiales para que cada lanzamiento viva dentro del ecosistema Many Ross.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="grid gap-4 md:grid-cols-4">
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <div key={chip.label} className="glass-panel flex items-center gap-3 rounded-[28px] p-5">
              <Icon className="h-5 w-5 text-gold" />
              <span className="text-sm uppercase tracking-[0.22em] text-white/72">{chip.label}</span>
            </div>
          );
        })}
      </FadeIn>

      <div className="grid gap-6 xl:grid-cols-3">
        {releases.map((release, index) => (
          <FadeIn key={release.title} delay={0.12 + index * 0.08}>
            <article className="glass-panel group overflow-hidden rounded-[34px]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={release.image}
                  alt={release.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]" />
                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold">
                  {release.type}
                </div>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-2xl uppercase tracking-[0.12em] text-ivory">
                    {release.title}
                  </h3>
                  <span className="text-xs uppercase tracking-[0.28em] text-white/46">{release.year}</span>
                </div>
                <p className="text-sm leading-7 text-white/60">{release.description}</p>
                <ExternalLink
                  href={release.href}
                  className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold transition hover:border-gold/60 hover:bg-gold/15"
                >
                  Abrir plataforma
                </ExternalLink>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
