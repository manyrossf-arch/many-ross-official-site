# Deploy En Vercel

## 0. Requisito local

Antes de validar o desplegar localmente, instala Node.js 20 o superior y npm en la maquina.

## 1. Preparar variables de entorno

1. Duplica `.env.example` como `.env.local`
2. Confirma el dominio final en `NEXT_PUBLIC_SITE_URL`
3. Agrega claves privadas reales cuando actives YouTube API y Printful

Variables publicas activas:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_YOUTUBE_URL`
- `NEXT_PUBLIC_SPOTIFY_URL`
- `NEXT_PUBLIC_APPLE_MUSIC_URL`
- `NEXT_PUBLIC_TIKTOK_URL`
- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_LATEST_VIDEO_URL`
- `NEXT_PUBLIC_YOUTUBE_SUBSCRIBE_URL`
- `NEXT_PUBLIC_SHORT_ONE_URL`
- `NEXT_PUBLIC_SHORT_TWO_URL`

Variables publicas opcionales:

- `NEXT_PUBLIC_FACEBOOK_URL`
- `NEXT_PUBLIC_STORE_URL`
- `NEXT_PUBLIC_PRINTFUL_STORE_URL`
- `NEXT_PUBLIC_MERCH_DROP_URL`
- `NEXT_PUBLIC_NEWSLETTER_URL`

Variables privadas:

- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`
- `PRINTFUL_API_KEY`
- `PRINTFUL_STORE_ID`

## 2. Instalar dependencias

```bash
npm install
```

## 3. Validar localmente

```bash
npm run lint
npm run build
```

## 4. Verificar antes del deploy

- Hero y navegacion con links oficiales
- Seccion musica conectada a Spotify, Apple Music y YouTube
- Seccion YouTube con CTAs oficiales
- Seccion redes visible
- Footer mostrando solo plataformas configuradas
- Facebook y tienda ocultos si no tienen URL
- Newsletter sin formularios ficticios
- Responsive en movil, tablet y desktop

## 5. Subir a Vercel

1. Sube este proyecto a GitHub
2. Entra a [Vercel](https://vercel.com)
3. Crea un nuevo proyecto
4. Importa el repositorio
5. Agrega todas las variables de entorno en `Project Settings > Environment Variables`
6. Deploy

## 6. Integraciones siguientes

Despues de aprobar la version desplegada:

- conectar YouTube API al endpoint `app/api/youtube/route.ts`
- conectar Printful a `app/api/printful/route.ts`
- activar tienda y merch cuando recibamos las URLs oficiales
