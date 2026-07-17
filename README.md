# Many Ross Official Experience

Sitio premium para la marca artistica `Many Ross`, construido con:

- Next.js
- React
- TypeScript
- TailwindCSS
- Framer Motion

## Objetivo

Convertir el sitio en el centro oficial de la marca:

- Musica
- YouTube
- Spotify
- Apple Music
- TikTok
- Instagram
- Team Many Ross
- Newsletter
- Integraciones futuras con tienda oficial y Printful

## Estructura

- `app/page.tsx` contiene la home principal
- `components/sections/*` contiene las secciones modulares
- `lib/site-data.ts` centraliza contenido y links iniciales
- `lib/site-config.ts` centraliza variables de entorno y enlaces oficiales
- `app/api/youtube/route.ts` prepara integracion YouTube API
- `app/api/printful/route.ts` prepara integracion Printful

## Estado actual

- Ya estan integrados los enlaces oficiales de YouTube, Spotify, Apple Music, TikTok e Instagram
- Facebook y tienda oficial permanecen ocultos hasta recibir sus URLs oficiales
- La arquitectura queda lista para activar YouTube API y Printful sin reconstruir el sitio

## Siguiente paso recomendado

1. Instalar dependencias
2. Correr `npm run dev`
3. Ajustar `.env.local` si cambian enlaces o dominios
4. Conectar API de YouTube
5. Conectar catalogo de Printful

## Deploy

La guia completa para produccion esta en:

- `DEPLOY-VERCEL.md`
