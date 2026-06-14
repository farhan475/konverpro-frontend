import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['192.168.0.173'],
  },
};

export default nextConfig;
