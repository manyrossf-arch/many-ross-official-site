import { PlayCircle, Radio, Youtube } from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/lib/site-config";
import { youtubeShowcase } from "@/lib/site-data";

export function YouTubeSection() {
  return (
    <section id="youtube" className="bg-white/[0.02] py-24">
      <div className="section-shell grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="min-w-0 space-y-8">
          <div className="section-heading min-w-0">
            <p className="eyebrow">YouTube oficial</p>
            <h2 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
              El canal como motor de watch time, discovery y autoridad.
            </h2>
            <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/60">
              Esta seccion ya funciona con enlaces reales al canal oficial. La integracion automatica con YouTube API se conectara despues, sin rehacer el sitio.
            </p>
          </div>

          <div className="glass-panel min-w-0 rounded-[34px] p-7">
            <div className="flex min-w-0 items-center gap-3">
              <Youtube className="h-6 w-6 shrink-0 text-[#FF0000]" />
              <p className="mobile-safe-title min-w-0 font-display text-[clamp(1.1rem,4vw,1.25rem)] uppercase tracking-[0.12em] text-ivory compact-tracking">
                {youtubeShowcase.spotlight.title}
              </p>
            </div>
            <p className="mobile-safe-copy mt-4 text-sm leading-7 text-white/62">
              {youtubeShowcase.spotlight.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ExternalLink href={siteConfig.links.youtube} className="inline-flex min-h-[3rem] max-w-full items-center rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-2 text-center text-xs uppercase tracking-[0.16em] text-white whitespace-normal compact-tracking">
                <span className="text-balance">Canal oficial</span>
              </ExternalLink>
              <ExternalLink href={siteConfig.links.shortOne} className="inline-flex min-h-[3rem] max-w-full items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs uppercase tracking-[0.16em] text-white/74 whitespace-normal compact-tracking">
                <span className="text-balance">Ver Shorts</span>
              </ExternalLink>
              <ExternalLink href={siteConfig.links.subscribe} className="inline-flex min-h-[3rem] max-w-full items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-center text-xs uppercase tracking-[0.16em] text-white/74 whitespace-normal compact-tracking">
                <span className="text-balance">Suscribirse</span>
              </ExternalLink>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-5">
          {youtubeShowcase.featured.map((item, index) => {
            const icons = [PlayCircle, Radio, Youtube, PlayCircle];
            const links = [
              siteConfig.links.youtube,
              siteConfig.links.shortOne,
              siteConfig.links.shortTwo,
              siteConfig.links.subscribe,
            ];
            const Icon = icons[index] ?? PlayCircle;

            return (
              <FadeIn key={item} delay={0.1 + index * 0.08}>
                <ExternalLink
                  href={links[index] ?? siteConfig.links.youtube}
                  className="glass-panel flex min-w-0 items-start gap-4 rounded-[30px] p-6 transition hover:border-gold/30 hover:bg-white/[0.06]"
                >
                  <div className="mt-1 rounded-2xl border border-white/10 bg-black/35 p-3 shrink-0">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="mobile-safe-title font-display text-[clamp(1rem,4vw,1.125rem)] uppercase tracking-[0.12em] text-ivory compact-tracking">{item}</p>
                    <p className="mobile-safe-copy text-sm leading-7 text-white/58">
                      Acceso real a la presencia oficial de Many Ross en YouTube, sin contenido simulado.
                    </p>
                  </div>
                </ExternalLink>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
