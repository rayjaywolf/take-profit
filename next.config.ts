import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@prisma/client");
    }
    return config;
  },
};

export default nextConfig;
