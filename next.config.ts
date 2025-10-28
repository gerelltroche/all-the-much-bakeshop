import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  // This creates a minimal production server with all dependencies bundled
  output: 'standalone',

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'allthemuchbakeshop.com',
      },
    ],
  },
};

export default nextConfig;
