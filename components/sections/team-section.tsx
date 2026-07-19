import { CalendarRange, Camera, Newspaper } from "lucide-react";
import Image from "next/image";

import { FadeIn } from "@/components/motion/fade-in";
import { teamTimeline } from "@/lib/site-data";

export function TeamSection() {
  const icons = [Camera, Newspaper, CalendarRange];

  return (
    <section id="team" className="bg-white/[0.02] py-24">
      <div className="section-shell grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <FadeIn className="space-y-6">
          <p className="eyebrow">Team Many Ross</p>
          <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
            Comunidad, historia y futuro del universo creativo.
          </h2>
          <p className="text-lg leading-8 text-white/60">
            Una seccion exclusiva para contar quienes estan detras del movimiento, mostrar fotos, noticias y proximos lanzamientos sin romper la estetica premium del sitio.
          </p>
          <div className="glass-panel rounded-[34px] p-7">
            <p className="text-sm uppercase tracking-[0.24em] text-gold">Historia editorial</p>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Team Many Ross puede crecer aqui como newsroom visual: updates, making-of, backstage, avances y piezas de identidad cultural de la marca.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-5">
          <FadeIn delay={0.06}>
            <div className="glass-panel overflow-hidden rounded-[34px] p-4">
              <div className="relative overflow-hidden rounded-[28px] border border-white/10">
                <div className="absolute left-4 top-4 z-10 rounded-full border border-gold/30 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.24em] text-gold">
                  Official Many Ross Visual
                </div>
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/images/many-ross-official-poster.jpeg"
                    alt="Poster oficial de Many Ross"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.4))]" />
                </div>
              </div>
            </div>
          </FadeIn>

          {teamTimeline.map((item, index) => {
            const Icon = icons[index] ?? Camera;

            return (
              <FadeIn key={item.title} delay={0.1 + index * 0.08}>
                <article className="glass-panel flex gap-5 rounded-[30px] p-6">
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg uppercase tracking-[0.14em] text-ivory">{item.title}</h3>
                    <p className="text-sm leading-7 text-white/58">{item.body}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
