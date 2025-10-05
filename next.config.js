const path = require('path');
const withLess = require('next-with-less');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const resolveAlias = {
  antd$: path.resolve(__dirname, 'lib/import/antd'),
};


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for Docker
  output: 'standalone',
  
  // Strict mode for better debugging
  reactStrictMode: true,
  
  // Power of Web
  poweredByHeader: false,
  
  // ESLint configuration
  eslint: {
    // We'll run ESLint separately in CI/CD
    ignoreDuringBuilds: true,
    dirs: ['app', 'components', 'hooks', 'lib', 'utils', 'stores', 'contexts']
  },
  
  // TypeScript configuration
  typescript: {
    // We'll run TypeScript check separately in CI/CD
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: { 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compiler options
  compiler: {
    // Remove styled-components in favor of Tailwind CSS
    // Keeping for backward compatibility during migration
    styledComponents: {
      displayName: true,
      ssr: true,
      fileName: true,
      cssProp: true,
    },
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Experimental features
  experimental: {
    // Enable server actions (Next.js 13.5.1 only supports boolean)
    serverActions: true,
    // Optimize package imports
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      'lucide-react',
      'recharts',
    ],
  },
  
  // Webpack configuration
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...resolveAlias,
    };
    return config;
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
