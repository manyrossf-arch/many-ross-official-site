import { ExternalLink } from "@/components/external-link";
import { socialLinks } from "@/lib/site-data";

export function SiteFooter() {
  const platformLinks = socialLinks.slice(0, 3);
  const communityLinks = socialLinks.slice(3);

  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="section-shell space-y-8 py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="eyebrow">Many Ross</p>
            <h2 className="font-display text-2xl uppercase tracking-[0.18em] text-ivory">
              Official Artist Hub
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/62">
              Musica, videos, comunidad, plataformas oficiales y lanzamientos disenados como una sola experiencia premium.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-gold">
              Plataformas
            </p>
            <div className="flex flex-col gap-2">
              {platformLinks.map((item) => (
                <ExternalLink key={item.label} href={item.href} className="text-sm text-white/65 transition hover:text-ivory">
                  {item.label}
                </ExternalLink>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-gold">
              Social
            </p>
            <div className="flex flex-col gap-2">
              {communityLinks.map((item) => (
                <ExternalLink key={item.label} href={item.href} className="text-sm text-white/65 transition hover:text-ivory">
                  {item.label}
                </ExternalLink>
              ))}
            </div>
          </div>
        </div>

        <div className="luxury-divider" />

        <div className="flex flex-col gap-3 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Many Ross. Todos los derechos reservados.</p>
          <p>Disenado para escalar como marca internacional.</p>
        </div>
      </div>
    </footer>
  );
}