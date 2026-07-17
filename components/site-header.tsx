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
      <div className="section-shell flex items-center justify-between py-4">
        <Link href="#inicio" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/20 to-crimson/20 text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            MR
          </div>
          <div className="space-y-0.5">
            <p className="font-display text-lg font-semibold uppercase tracking-[0.24em] text-ivory">
              Many Ross
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-white/50">
              Official Experience
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm uppercase tracking-[0.24em] text-white/60 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ExternalLink
            href={siteConfig.links.spotify}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-5 py-3 text-sm font-medium text-ivory transition hover:border-gold/60 hover:bg-white/10"
          >
            <Play className="h-4 w-4 text-gold" />
            Escuchar musica
          </ExternalLink>
          <ExternalLink
            href={siteConfig.links.youtube}
            className="inline-flex items-center gap-2 rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-5 py-3 text-sm font-medium text-ivory transition hover:border-[#FF0000]/60 hover:bg-[#FF0000]/15"
          >
            <Youtube className="h-4 w-4 text-[#FF0000]" />
            YouTube
          </ExternalLink>
        </div>

        <button
          type="button"
          aria-label="Abrir menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ivory lg:hidden"
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
                className="text-sm uppercase tracking-[0.24em] text-white/70"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="luxury-divider" />

            <div className="grid gap-3 sm:grid-cols-2">
              <ExternalLink
                href={siteConfig.links.spotify}
                className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-gold/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-gold"
              >
                Escuchar en Spotify
              </ExternalLink>
              <ExternalLink
                href={siteConfig.links.youtube}
                className="inline-flex items-center justify-center rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white"
              >
                Ver YouTube
              </ExternalLink>
            </div>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item) => (
                <ExternalLink
                  key={item.label}
                  href={item.href}
                  className="text-xs uppercase tracking-[0.22em] text-white/56 transition hover:text-gold"
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
