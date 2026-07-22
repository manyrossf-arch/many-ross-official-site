"use client";

import { Menu, Play, Youtube, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ExternalLink } from "@/components/external-link";
import { siteConfig } from "@/lib/site-config";
import { navigation, socialLinks } from "@/lib/site-data";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-background/70 backdrop-blur-2xl">
      <div className="section-shell flex items-center justify-between gap-3 py-3 sm:py-4">
        <Link href="#inicio" className="flex min-w-0 flex-1 items-center gap-3 pr-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/20 to-crimson/20 text-xs font-semibold uppercase tracking-[0.18em] text-gold sm:h-11 sm:w-11 sm:text-sm sm:tracking-[0.28em]">
            MR
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className="truncate font-display text-[clamp(1rem,4vw,1.125rem)] font-semibold uppercase tracking-[0.14em] text-ivory compact-tracking">
              Many Ross
            </p>
            <p className="hidden truncate text-[10px] uppercase tracking-[0.18em] text-white/50 min-[360px]:block compact-eyebrow">
              Official Experience
            </p>
          </div>
        </Link>

        <nav className="hidden min-w-0 items-center gap-6 xl:gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-balance text-sm uppercase tracking-[0.16em] text-white/60 transition hover:text-gold xl:tracking-[0.24em]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ExternalLink
            href={siteConfig.links.spotify}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-3 text-center text-sm font-medium text-ivory transition hover:border-gold/60 hover:bg-white/10 xl:px-5 whitespace-normal"
          >
            <Play className="h-4 w-4 shrink-0 text-gold" />
            <span className="text-balance">Escuchar musica</span>
          </ExternalLink>
          <ExternalLink
            href={siteConfig.links.youtube}
            className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-3 text-center text-sm font-medium text-ivory transition hover:border-[#FF0000]/60 hover:bg-[#FF0000]/15 xl:px-5 whitespace-normal"
          >
            <Youtube className="h-4 w-4 shrink-0 text-[#FF0000]" />
            <span className="text-balance">YouTube</span>
          </ExternalLink>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ivory lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/8 bg-black/75 lg:hidden">
          <div className="section-shell flex flex-col gap-5 py-5">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-balance text-sm uppercase tracking-[0.16em] text-white/70 compact-tracking"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="luxury-divider" />

            <div className="grid gap-3 sm:grid-cols-2">
              <ExternalLink
                href={siteConfig.links.spotify}
                className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-gold/30 bg-gold/10 px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-gold whitespace-normal"
              >
                <span className="text-balance">Escuchar en Spotify</span>
              </ExternalLink>
              <ExternalLink
                href={siteConfig.links.youtube}
                className="inline-flex min-h-[3.25rem] items-center justify-center rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-3 text-center text-xs uppercase tracking-[0.18em] text-white whitespace-normal"
              >
                <span className="text-balance">Ver YouTube</span>
              </ExternalLink>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <ExternalLink
                  key={item.label}
                  href={item.href}
                  className="text-xs uppercase tracking-[0.16em] text-white/56 transition hover:text-gold compact-tracking"
                >
                  {item.label}
                </ExternalLink>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
