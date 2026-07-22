import { ExternalLink } from "@/components/external-link";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/lib/site-config";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="section-shell py-24">
      <FadeIn>
        <div className="glass-panel relative overflow-hidden rounded-[42px] p-8 sm:p-12">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-gold/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-crimson/40 blur-[110px]" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div className="min-w-0 space-y-5">
              <p className="eyebrow">Newsletter</p>
              <h2 className="mobile-safe-title fluid-section-title compact-tracking font-display uppercase text-ivory">
                Unete a Team Many Ross
              </h2>
              <p className="mobile-safe-copy max-w-2xl text-[clamp(1rem,3.8vw,1.125rem)] leading-7 sm:leading-8 text-white/62">
                La seccion ya esta disenada para captacion premium. El formulario real se activara al conectar el proveedor oficial de email en produccion.
              </p>
            </div>

            <div className="min-w-0 space-y-4 rounded-[30px] border border-white/10 bg-black/30 p-6">
              <p className="text-sm uppercase tracking-[0.18em] text-gold compact-tracking">Estado actual</p>
              <p className="mobile-safe-copy text-sm leading-7 text-white/62">
                No se ha configurado todavia una plataforma oficial para newsletter, asi que aqui no dejamos formularios ficticios ni envios vacios.
              </p>
              {siteConfig.visibility.newsletter ? (
                <ExternalLink
                  href={siteConfig.links.newsletter}
                  className="inline-flex min-h-[3.5rem] w-full max-w-full items-center justify-center rounded-full bg-gradient-to-r from-gold to-[#e2b95e] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-glow transition hover:scale-[1.01] whitespace-normal compact-tracking"
                >
                  <span className="text-balance">Unirme a la lista</span>
                </ExternalLink>
              ) : (
                <div className="mobile-safe-copy rounded-2xl border border-dashed border-gold/30 bg-gold/10 px-5 py-4 text-sm leading-7 text-gold/90">
                  Pendiente de activacion. Cuando recibamos la URL oficial del proveedor, este bloque se convierte en CTA real sin cambiar el diseno.
                </div>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
