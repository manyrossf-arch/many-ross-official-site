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
            <div className="space-y-5">
              <p className="eyebrow">Newsletter</p>
              <h2 className="font-display text-4xl uppercase tracking-[0.14em] text-ivory md:text-5xl">
                Unete a Team Many Ross
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-white/62">
                La seccion ya esta disenada para captacion premium. El formulario real se activara al conectar el proveedor oficial de email en produccion.
              </p>
            </div>

            <div className="space-y-4 rounded-[30px] border border-white/10 bg-black/30 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-gold">Estado actual</p>
              <p className="text-sm leading-7 text-white/62">
                No se ha configurado todavia una plataforma oficial para newsletter, asi que aqui no dejamos formularios ficticios ni envios vacios.
              </p>
              {siteConfig.visibility.newsletter ? (
                <ExternalLink
                  href={siteConfig.links.newsletter}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-gold to-[#e2b95e] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black shadow-glow transition hover:scale-[1.01]"
                >
                  Unirme a la lista
                </ExternalLink>
              ) : (
                <div className="rounded-2xl border border-dashed border-gold/30 bg-gold/10 px-5 py-4 text-sm leading-7 text-gold/90">
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
