import { CalendarRange, Camera, Newspaper } from "lucide-react";

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
