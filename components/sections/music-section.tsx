"use client";

import { Disc3, Film, RadioTower } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

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
      <FadeIn className="section-heading min-w-0">
        <p className="eyebrow">Escucha mi musica</p>
        <h2 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
          Catalogo disenado para vivirse como una experiencia editorial premium.
        </h2>
        <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/60">
          Spotify, Apple Music y YouTube ya quedaron conectados con los enlaces oficiales para que cada lanzamiento viva dentro del ecosistema Many Ross.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} className="grid gap-4 md:grid-cols-4">
        {chips.map((chip) => {
          const Icon = chip.icon;
          return (
            <div key={chip.label} className="glass-panel flex min-w-0 items-center gap-3 rounded-[28px] p-5">
              <Icon className="h-5 w-5 shrink-0 text-gold" />
              <span className="text-balance text-sm uppercase tracking-[0.14em] text-white/72 compact-tracking">{chip.label}</span>
            </div>
          );
        })}
      </FadeIn>

      <div className="grid gap-6 xl:grid-cols-3">
        {releases.map((release, index) => {
          const isYouTubeCard = release.title === "Many Ross en YouTube";
          const isAppleMusicCard = release.title === "Many Ross en Apple Music";

          return (
            <FadeIn key={release.title} delay={0.12 + index * 0.08}>
              <article className={isYouTubeCard ? "glass-panel group min-w-0 overflow-hidden rounded-[34px] border border-[#ff2d2d]/20 shadow-[0_24px_60px_rgba(94,13,19,0.24)]" : "glass-panel group min-w-0 overflow-hidden rounded-[34px]"}>
                <div className={isYouTubeCard ? "relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(255,0,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(201,162,75,0.16),transparent_32%),linear-gradient(180deg,#090909_0%,#140708_100%)]" : isAppleMusicCard ? "relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(201,162,75,0.12),transparent_32%),linear-gradient(180deg,#0b0b0b_0%,#161616_100%)]" : "relative aspect-[4/3] overflow-hidden"}>
                  <Image
                    src={release.image}
                    alt={release.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 33vw"
                    className={isYouTubeCard ? "object-contain object-center p-4 transition duration-700 group-hover:scale-[1.02] sm:p-5" : isAppleMusicCard ? "object-contain object-center p-4 transition duration-700 group-hover:scale-[1.02] sm:p-6" : "object-cover transition duration-700 group-hover:scale-105"}
                  />
                  <div className={isYouTubeCard ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(14,5,6,0.56)_58%,rgba(0,0,0,0.8))]" : isAppleMusicCard ? "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(12,12,12,0.34)_54%,rgba(0,0,0,0.78))]" : "absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]"} />
                  {isYouTubeCard ? <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" /> : null}
                  <div className={isYouTubeCard ? "absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-[#ff2d2d]/30 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-gold compact-eyebrow" : "absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-gold compact-eyebrow"}>
                    <span className="text-balance">{release.type}</span>
                  </div>
                </div>
                <div className="space-y-4 p-6 min-w-0">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="mobile-safe-title fluid-card-title compact-tracking min-w-0 font-display uppercase text-ivory sm:pr-3">
                      {release.title}
                    </h3>
                    <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-white/46 compact-eyebrow">{release.year}</span>
                  </div>
                  <p className="mobile-safe-copy text-sm leading-7 text-white/60">{release.description}</p>
                  <ExternalLink
                    href={release.href}
                    className={isYouTubeCard ? "inline-flex min-h-[3rem] max-w-full items-center rounded-full border border-[#ff2d2d]/30 bg-[#5E0D13]/45 px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-gold transition hover:border-gold/60 hover:bg-[#5E0D13]/60 whitespace-normal compact-tracking" : "inline-flex min-h-[3rem] max-w-full items-center rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-gold transition hover:border-gold/60 hover:bg-gold/15 whitespace-normal compact-tracking"}
                  >
                    <span className="text-balance">Abrir plataforma</span>
                  </ExternalLink>
                </div>
              </article>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}