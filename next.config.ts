import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output creates a self-contained build directory for efficient
  // Node.js server deployments (Hostinger, VPS, Docker, etc.)
  output: "standalone",

  // Allow images from external sources used in the app
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
      {
        protocol: "https",
        hostname: "**.waqi.info",
      },
    ],
  },
};

export default nextConfig;
