import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/noto',
  assetPrefix: '/noto',
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  eslint: {
  ignoreDuringBuilds: true,
},
async redirects() {
  return [
    {
      source: '/',
      destination: '/noto/landing',
      basePath: false,
      permanent: false,
    },
    {
      source: '/noto',
      destination: '/noto/landing',
      permanent: false,
    }
  ]
}
};

export default nextConfig;
