import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack correctly bundles Sanity's ESM packages
  transpilePackages: ["sanity", "next-sanity", "@sanity/ui", "@sanity/icons"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
