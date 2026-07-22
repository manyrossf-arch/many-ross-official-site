import { CheckCircle2 } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { integrations } from "@/lib/site-data";

export function IntegrationSection() {
  return (
    <section className="section-shell py-24">
      <FadeIn className="glass-panel rounded-[38px] p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0 space-y-5">
            <p className="eyebrow">Tecnologia + Escalabilidad</p>
            <h2 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
              Disenado para crecer sin reconstruir todo manana.
            </h2>
            <p className="mobile-safe-copy text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/60">
              La arquitectura esta preparada para integrar APIs, e-commerce, automatizaciones y modulos nuevos sin romper la identidad premium de la marca.
            </p>
          </div>

          <div className="grid gap-4">
            {integrations.map((item, index) => (
              <FadeIn key={item} delay={0.08 + index * 0.04}>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <p className="mobile-safe-copy min-w-0 text-sm leading-7 text-white/70">{item}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
