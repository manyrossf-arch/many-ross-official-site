import { PlayCircle, Radio, Youtube } from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/lib/site-config";
import { youtubeShowcase } from "@/lib/site-data";

export function YouTubeSection() {
  return (
    <section id="youtube" className="bg-white/[0.02] py-24">
      <div className="section-shell grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <FadeIn className="space-y-8">
          <div className="section-heading">
            <p className="eyebrow">YouTube oficial</p>
            <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
              El canal como motor de watch time, discovery y autoridad.
            </h2>
            <p className="text-lg leading-8 text-white/60">
              Esta seccion ya funciona con enlaces reales al canal oficial. La integracion automatica con YouTube API se conectara despues, sin rehacer el sitio.
            </p>
          </div>

          <div className="glass-panel rounded-[34px] p-7">
            <div className="flex items-center gap-3">
              <Youtube className="h-6 w-6 text-[#FF0000]" />
              <p className="font-display text-xl uppercase tracking-[0.16em] text-ivory">
                {youtubeShowcase.spotlight.title}
              </p>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/62">
              {youtubeShowcase.spotlight.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ExternalLink href={siteConfig.links.youtube} className="rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white">
                Canal oficial
              </ExternalLink>
              <ExternalLink href={siteConfig.links.shortOne} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/74">
                Ver Shorts
              </ExternalLink>
              <ExternalLink href={siteConfig.links.subscribe} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/74">
                Suscribirse
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
                  className="glass-panel flex items-start gap-4 rounded-[30px] p-6 transition hover:border-gold/30 hover:bg-white/[0.06]"
                >
                  <div className="mt-1 rounded-2xl border border-white/10 bg-black/35 p-3">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-display text-lg uppercase tracking-[0.14em] text-ivory">{item}</p>
                    <p className="text-sm leading-7 text-white/58">
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
