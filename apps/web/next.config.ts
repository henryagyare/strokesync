import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@strokesync/shared', '@strokesync/ui'],
  experimental: {
    // optimizePackageImports: ['lucide-react'],
  },
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
