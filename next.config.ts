import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/noto-dashboard',
  assetPrefix: '/noto-dashboard',
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  eslint: {
  ignoreDuringBuilds: true,
},
};

export default nextConfig;
