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
      <div className="section-shell relative grid gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24 xl:gap-16">
        <div className="relative z-10 min-w-0 space-y-10">
          <FadeIn className="space-y-6 min-w-0">
            <span className="eyebrow compact-eyebrow">Spotify x Apple Music x Cinema Language</span>
            <h1 className="mobile-safe-title fluid-display compact-tracking max-w-5xl font-display font-semibold uppercase text-ivory">
              La musica cuenta historias que el corazon nunca olvida.
            </h1>
            <p className="mobile-safe-copy max-w-2xl text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/66">
              El centro oficial de la marca Many Ross: musica, videos, comunidad y una experiencia cinematografica hecha para sentirse internacional.
            </p>
          </FadeIn>

          <FadeIn delay={0.08} className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <ExternalLink
              href={siteConfig.links.spotify}
              className="inline-flex min-h-[3.5rem] max-w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gold to-[#e0b758] px-6 py-4 text-center text-base font-semibold text-black shadow-glow transition hover:scale-[1.01] whitespace-normal sm:px-8 sm:py-5"
            >
              <Play className="h-5 w-5 shrink-0" />
              <span className="text-balance">Escuchar Musica</span>
            </ExternalLink>
            <ExternalLink
              href={siteConfig.links.youtube}
              className="inline-flex min-h-[3.5rem] max-w-full items-center justify-center gap-3 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-6 py-4 text-center text-base font-semibold text-ivory transition hover:bg-[#FF0000]/15 whitespace-normal sm:px-8 sm:py-5"
            >
              <Youtube className="h-5 w-5 shrink-0" />
              <span className="text-balance">YouTube</span>
            </ExternalLink>
            <ExternalLink
              href={siteConfig.links.appleMusic}
              className="inline-flex min-h-[3.5rem] max-w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/6 px-6 py-4 text-center text-base font-semibold text-ivory transition hover:border-gold/40 hover:bg-white/10 whitespace-normal sm:px-8 sm:py-5"
            >
              <span className="text-balance">Apple Music</span>
            </ExternalLink>
          </FadeIn>

          <FadeIn delay={0.12} className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel min-w-0 rounded-[28px] p-5">
                <p className="font-display text-[clamp(1.4rem,5vw,2rem)] uppercase tracking-[0.12em] text-gold compact-tracking">{stat.value}</p>
                <p className="mt-2 text-sm text-white/58 text-anywhere">{stat.label}</p>
              </div>
            ))}
          </FadeIn>

          <FadeIn delay={0.18} className="grid gap-4 xl:grid-cols-3">
            {platformCards.map((card) => (
              <div
                key={card.title}
                className={`glass-panel relative min-w-0 overflow-hidden rounded-[30px] p-6 before:absolute before:inset-0 before:bg-gradient-to-br ${card.accent}`}
              >
                <div className="relative min-w-0 space-y-3">
                  <p className="mobile-safe-title font-display text-[clamp(1rem,4vw,1.125rem)] uppercase tracking-[0.14em] text-ivory compact-tracking">{card.title}</p>
                  <p className="mobile-safe-copy text-sm leading-7 text-white/58">{card.body}</p>
                  <ExternalLink href={card.href} className="text-sm font-medium uppercase tracking-[0.18em] text-gold compact-tracking">
                    Entrar
                  </ExternalLink>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="relative flex min-w-0 items-center justify-center lg:justify-end">
          <div className="absolute inset-x-6 top-16 h-56 rounded-full bg-gold/20 blur-[130px]" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel relative w-full max-w-[720px] overflow-hidden rounded-[40px] border-gold/20 p-3 sm:p-4 lg:p-5"
          >
            <div className="absolute inset-0 bg-halo opacity-60" />
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-black/20">
              <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(4,8,16,0.06),rgba(4,8,16,0.14)_30%,rgba(4,8,16,0.2)_62%,rgba(4,8,16,0.32)_100%)] lg:bg-[linear-gradient(90deg,rgba(4,8,16,0.2)_0%,rgba(4,8,16,0.08)_26%,rgba(4,8,16,0.02)_54%,rgba(4,8,16,0.18)_100%)]" />
              <div className="absolute left-3 top-3 z-20 max-w-[calc(100%-1.5rem)] rounded-full border border-gold/30 bg-black/35 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-gold backdrop-blur-sm sm:left-6 sm:top-6 sm:px-4 sm:text-[11px] sm:tracking-[0.26em] compact-eyebrow">
                <span className="text-balance">Nivel Leyenda</span>
              </div>
              <div className="absolute bottom-3 left-3 z-20 max-w-[calc(100%-1.5rem)] rounded-full border border-white/12 bg-black/28 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm sm:bottom-6 sm:left-6 sm:px-4 sm:tracking-[0.2em] compact-eyebrow">
                <span className="text-balance">Official Many Ross Visual</span>
              </div>
              <div className="relative aspect-[3/5] min-h-[640px] sm:aspect-[2/3] sm:min-h-[860px] md:min-h-[920px] lg:aspect-[4/5] lg:min-h-[860px] xl:min-h-[900px]">
                <Image
                  src="/images/many-ross-hero.jpg"
                  alt="Imagen oficial de Many Ross con visual Nivel Leyenda"
                  fill
                  priority
                  sizes="(max-width: 430px) 100vw, (max-width: 768px) 92vw, (max-width: 1024px) 80vw, 48vw"
                  className="object-cover object-[50%_48%] sm:object-[51%_46%] md:object-[53%_41%] lg:object-[56%_40%] xl:object-[57%_38%]"
                />
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
