import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/.next/**', '**/node_modules/**', '**/*.tsbuildinfo'],
      };
    }
    return config;
  },
};

export default nextConfig;
