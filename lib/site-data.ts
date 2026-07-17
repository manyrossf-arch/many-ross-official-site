import type { LucideIcon } from "lucide-react";
import {
  Disc3,
  Instagram,
  Music2,
  Play,
  ShoppingBag,
  Shirt,
  Sparkles,
  Ticket,
  Youtube,
} from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export const navigation = [
  { label: "Inicio", href: "#inicio", show: true },
  { label: "Musica", href: "#musica", show: true },
  { label: "YouTube", href: "#youtube", show: true },
  { label: "Tienda", href: "#tienda", show: siteConfig.visibility.store },
  { label: "Team Many Ross", href: "#team", show: true },
  { label: "Redes", href: "#redes", show: true },
  { label: "Newsletter", href: "#newsletter", show: true },
].filter((item) => item.show);

export const socialLinks: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  { label: "YouTube", href: siteConfig.links.youtube, icon: Youtube },
  { label: "Spotify", href: siteConfig.links.spotify, icon: Music2 },
  { label: "Apple Music", href: siteConfig.links.appleMusic, icon: Disc3 },
  { label: "TikTok", href: siteConfig.links.tiktok, icon: Play },
  { label: "Instagram", href: siteConfig.links.instagram, icon: Instagram },
].filter((item) => item.href);

export const platformCards = [
  {
    title: "Spotify",
    body: "Catalogo oficial, lanzamientos y ecosistema de playlists listo para escalar cada sencillo.",
    href: siteConfig.links.spotify,
    accent: "from-[#1DB954]/30 via-[#1DB954]/10 to-transparent",
  },
  {
    title: "Apple Music",
    body: "Experiencia editorial, clean y premium alineada con una identidad internacional.",
    href: siteConfig.links.appleMusic,
    accent: "from-white/20 via-white/10 to-transparent",
  },
  {
    title: "YouTube",
    body: "Canal oficial, Shorts y contenido audiovisual listos para escalar watch time y presencia de marca.",
    href: siteConfig.links.youtube,
    accent: "from-[#FF0000]/25 via-[#5E0D13]/18 to-transparent",
  },
];

export const stats = [
  { value: "81K+", label: "Visualizaciones en 28 dias" },
  { value: "3.5K+", label: "Horas publicas validas" },
  { value: "1 Hub", label: "Marca centralizada" },
];

export const releases = [
  {
    type: "Sencillo",
    title: "Titanio y Salitre",
    year: "2026",
    description:
      "Una pieza de resistencia, brillo y narrativa urbana construida como himno visual.",
    image: "/images/titanio-y-salitre-cover.png",
    href: siteConfig.links.spotify,
  },
  {
    type: "Canal Oficial",
    title: "Many Ross en YouTube",
    year: "2026",
    description:
      "Canal oficial para videos, Shorts y estrategia audiovisual enfocada en crecimiento y monetizacion.",
    image: "/images/titanio-y-salitre-cover.png",
    href: siteConfig.links.youtube,
  },
  {
    type: "Streaming",
    title: "Many Ross en Apple Music",
    year: "2026",
    description:
      "Acceso editorial al universo sonoro de Many Ross en una experiencia clean y premium.",
    image: "/images/titanio-y-salitre-cover.png",
    href: siteConfig.links.appleMusic,
  },
];

export const youtubeShowcase = {
  spotlight: {
    title: "Many Ross | Canal Oficial",
    description:
      "La arquitectura ya esta preparada para consumir YouTube API despues. Por ahora, los accesos dirigen al canal oficial, Shorts y suscripcion real.",
  },
  featured: [
    "Canal oficial",
    "Shorts del artista",
    "Biblioteca de videos",
    "Suscripcion directa",
  ],
};

export const storeCategories = [
  { title: "T-Shirts", icon: Shirt },
  { title: "Hoodies", icon: ShoppingBag },
  { title: "Gorras", icon: Ticket },
  { title: "Tazas", icon: Sparkles },
  { title: "Accesorios", icon: ShoppingBag },
  { title: "Coleccion Dominicana", icon: Sparkles },
  { title: "Coleccion Team Many Ross", icon: Sparkles },
  { title: "Coleccion Nivel Leyenda", icon: Sparkles },
];

export const merchItems = [
  {
    title: "Titanio y Salitre Tee",
    price: "$54",
    image: "/images/titanio-y-salitre-tee.png",
    tag: "Edicion Limitada",
  },
  {
    title: "Nivel Leyenda Cap",
    price: "$42",
    image: "/images/nivel-leyenda-cap.png",
    tag: "Drop Exclusivo",
  },
];

export const phrases = [
  "Si el barco se me hunde... lo convierto en submarino.",
  "Nivel Leyenda",
  "Dignidad Perdida",
  "No dejamos que el algoritmo decida cuando dejamos de crear.",
];

export const teamTimeline = [
  {
    title: "Historia",
    body: "Many Ross evoluciona como marca artistica con identidad premium, calle y vision cinematografica.",
  },
  {
    title: "Noticias",
    body: "Espacio modular para publicar updates, sesiones, colaboraciones y movimientos del proyecto.",
  },
  {
    title: "Proximos lanzamientos",
    body: "Base lista para presentar proximos sencillos, teasers, premieres y campanas de watch time.",
  },
];

export const integrations = [
  "YouTube API preparada para integrarse sin rehacer la interfaz",
  "Spotify y Apple Music conectados mediante enlaces oficiales",
  "Printful listo para activarse cuando llegue la URL de tienda",
  "Tienda oficial oculta hasta recibir enlace definitivo",
  "Newsletter preparado para conectar un proveedor real sin redisenar el sitio",
];
