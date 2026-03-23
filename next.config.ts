import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.transloadit.com" },
      { protocol: "https", hostname: "**.tlcdn.com" },
      { protocol: "https", hostname: "**.assembly-uploads.com" },
    ],
  },
  serverExternalPackages: ["sharp", "@google/generative-ai"],
};

export default nextConfig;
