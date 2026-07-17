import { Disc3, Headphones, Instagram, Music2, Play, Youtube } from "lucide-react";

import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { socialLinks } from "@/lib/site-data";

const iconMap = {
  YouTube: Youtube,
  Spotify: Music2,
  "Apple Music": Disc3,
  TikTok: Play,
  Instagram: Instagram,
} as const;

export function SocialSection() {
  return (
    <section id="redes" className="section-shell py-24">
      <FadeIn className="section-heading">
        <p className="eyebrow">Redes y plataformas</p>
        <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
          Todo el universo Many Ross conectado desde un solo lugar.
        </h2>
        <p className="text-lg leading-8 text-white/60">
          Cada enlace oficial esta visible donde suma mas valor: escucha, discovery, comunidad y conversion en una sola ruta clara para el publico.
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {socialLinks.map((item, index) => {
          const Icon = iconMap[item.label as keyof typeof iconMap] ?? Headphones;

          return (
            <FadeIn key={item.label} delay={0.08 + index * 0.05}>
              <ExternalLink
                href={item.href}
                className="glass-panel group flex h-full flex-col justify-between rounded-[32px] p-6 transition hover:border-gold/30 hover:bg-white/[0.06]"
              >
                <div className="space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-display text-xl uppercase tracking-[0.14em] text-ivory">{item.label}</p>
                    <p className="mt-3 text-sm leading-7 text-white/58">
                      Acceso directo al perfil oficial para escuchar, descubrir y seguir el movimiento.
                    </p>
                  </div>
                </div>
                <span className="mt-6 text-xs uppercase tracking-[0.24em] text-gold">Abrir plataforma</span>
              </ExternalLink>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
