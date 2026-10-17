import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["framer-motion"] },
  env: {
    NEXT_PUBLIC_BUILD_SHA: (process.env.VERCEL_GIT_COMMIT_SHA ?? "local000").slice(0, 7),
  },
};

export default nextConfig;
