"use client";

import { motion } from "framer-motion";
import { Play, Youtube } from "lucide-react";
import Image from "next/image";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/lib/site-config";
import { platformCards, stats } from "@/lib/site-data";

export function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,75,0.18),transparent_28%),radial-gradient(circle_at_75%_18%,rgba(94,13,19,0.32),transparent_24%)]" />
      <div className="section-shell relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="relative z-10 space-y-10">
          <FadeIn className="space-y-6">
            <span className="eyebrow">Spotify x Apple Music x Cinema Language</span>
            <h1 className="max-w-5xl font-display text-5xl font-semibold uppercase leading-[0.92] tracking-[0.08em] text-ivory sm:text-6xl xl:text-7xl">
              La musica cuenta historias que el corazon nunca olvida.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/66">
              El centro oficial de la marca Many Ross: musica, videos, comunidad y una experiencia cinematografica hecha para sentirse internacional.
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ExternalLink
              href={siteConfig.links.spotify}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold to-[#e0b758] px-8 py-5 text-base font-semibold text-black shadow-glow transition hover:scale-[1.01]"
            >
              <Play className="h-5 w-5" />
              Escuchar Musica
            </ExternalLink>
            <ExternalLink
              href={siteConfig.links.youtube}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-8 py-5 text-base font-semibold text-ivory transition hover:bg-[#FF0000]/15"
            >
              <Youtube className="h-5 w-5" />
              YouTube
            </ExternalLink>
            <ExternalLink
              href={siteConfig.links.appleMusic}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/6 px-8 py-5 text-base font-semibold text-ivory transition hover:border-gold/40 hover:bg-white/10"
            >
              Apple Music
            </ExternalLink>
          </FadeIn>

          <FadeIn delay={0.12} className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-[28px] p-5">
                <p className="font-display text-2xl uppercase tracking-[0.16em] text-gold">{stat.value}</p>
                <p className="mt-2 text-sm text-white/58">{stat.label}</p>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.18} className="grid gap-4 xl:grid-cols-3">
            {platformCards.map((card) => (
              <div
                key={card.title}
                className={`glass-panel relative overflow-hidden rounded-[30px] p-6 before:absolute before:inset-0 before:bg-gradient-to-br ${card.accent}`}
              >
                <div className="relative space-y-3">
                  <p className="font-display text-lg uppercase tracking-[0.24em] text-ivory">{card.title}</p>
                  <p className="text-sm leading-7 text-white/58">{card.body}</p>
                  <ExternalLink href={card.href} className="text-sm font-medium uppercase tracking-[0.24em] text-gold">
                    Entrar
                  </ExternalLink>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="relative flex items-center justify-center lg:justify-end">
          <div className="absolute inset-x-6 top-12 h-48 rounded-full bg-gold/20 blur-[120px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-[40px] border-gold/20 p-3 sm:p-4 lg:p-5"
          >
            <div className="absolute inset-0 bg-halo opacity-70" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/35">
              <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(3,6,12,0.12),rgba(3,6,12,0.22)_30%,rgba(3,6,12,0.55)_72%,rgba(3,6,12,0.85)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,6,12,0.68)_0%,rgba(3,6,12,0.18)_34%,rgba(3,6,12,0.06)_60%,rgba(3,6,12,0.5)_100%)]" />
              <div className="absolute left-4 top-4 z-20 rounded-full border border-gold/30 bg-black/45 px-4 py-2 text-[11px] uppercase tracking-[0.26em] text-gold sm:left-6 sm:top-6">
                Nivel Leyenda
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-20 rounded-[22px] border border-white/12 bg-black/40 px-4 py-4 backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm sm:px-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold/90">Many Ross Universe</p>
                <p className="mt-3 font-display text-2xl uppercase leading-[0.98] tracking-[0.08em] text-ivory sm:text-3xl">
                  No es suerte, es Dios, disciplina y pasion.
                </p>
              </div>
              <div className="relative aspect-[4/5] min-h-[540px] sm:min-h-[640px] lg:min-h-[760px]">
                <Image
                  src="/images/many-ross-hero.jpg"
                  alt="Imagen oficial de Many Ross con visual Nivel Leyenda"
                  fill
                  priority
                  sizes="(max-width: 430px) 100vw, (max-width: 768px) 92vw, 48vw"
                  className="object-cover object-[60%_center] sm:object-[58%_center] md:object-[57%_center] lg:object-[54%_center] xl:object-[52%_center]"
                />
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
