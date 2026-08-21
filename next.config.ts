import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "desk-revolution.de",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
