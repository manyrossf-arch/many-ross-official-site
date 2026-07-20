const withFallback = (value: string | undefined, fallback = "") => value?.trim() || fallback;
const hasUrl = (value: string) => value.length > 0;

const links = {
  youtube: withFallback(process.env.NEXT_PUBLIC_YOUTUBE_URL, "https://www.youtube.com/@manyross2515"),
  spotify: withFallback(process.env.NEXT_PUBLIC_SPOTIFY_URL, "http://bit.ly/3HskMXY"),
  appleMusic: withFallback(process.env.NEXT_PUBLIC_APPLE_MUSIC_URL, "https://music.apple.com/es/artist/many-ross/1820711560"),
  tiktok: withFallback(process.env.NEXT_PUBLIC_TIKTOK_URL, "https://www.tiktok.com/@manyross.f"),
  instagram: withFallback(process.env.NEXT_PUBLIC_INSTAGRAM_URL, "https://bit.ly/47zd6O6"),
  facebook: withFallback(process.env.NEXT_PUBLIC_FACEBOOK_URL, ""),
  officialStore: withFallback(process.env.NEXT_PUBLIC_STORE_URL, ""),
  printful: withFallback(process.env.NEXT_PUBLIC_PRINTFUL_STORE_URL, ""),
  newsletter: withFallback(process.env.NEXT_PUBLIC_NEWSLETTER_URL, ""),
  latestVideo: withFallback(process.env.NEXT_PUBLIC_LATEST_VIDEO_URL, "https://www.youtube.com/@manyross2515"),
  subscribe: withFallback(process.env.NEXT_PUBLIC_YOUTUBE_SUBSCRIBE_URL, "https://www.youtube.com/@manyross2515?sub_confirmation=1"),
  shortOne: withFallback(process.env.NEXT_PUBLIC_SHORT_ONE_URL, "https://www.youtube.com/@manyross2515/shorts"),
  shortTwo: withFallback(process.env.NEXT_PUBLIC_SHORT_TWO_URL, "https://www.youtube.com/@manyross2515/shorts"),
  teamNews: withFallback(process.env.NEXT_PUBLIC_TEAM_NEWS_URL, "#team"),
  merchDrop: withFallback(process.env.NEXT_PUBLIC_MERCH_DROP_URL, withFallback(process.env.NEXT_PUBLIC_STORE_URL, "")),
} as const;

export const siteConfig = {
  brandName: "Many Ross",
  siteUrl: withFallback(process.env.NEXT_PUBLIC_SITE_URL, "https://manyross.com"),
  links,
  visibility: {
    facebook: hasUrl(links.facebook),
    store: true,
    printful: hasUrl(links.printful),
    newsletter: hasUrl(links.newsletter),
  },
  api: {
    youtubeKey: process.env.YOUTUBE_API_KEY || "",
    youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || "",
    printfulTokenConfigured: Boolean(process.env.PRINTFUL_API_TOKEN?.trim()),
  },
};
