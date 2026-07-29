import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.printful.com",
      },
      {
        protocol: "https",
        hostname: "*.printfulcdn.com",
      },
      {
        protocol: "https",
        hostname: "*.cdn.printful.com",
      },
    ],
  },
};

export default nextConfig;
