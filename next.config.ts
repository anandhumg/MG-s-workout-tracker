import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,

  // Improve production builds by compressing output
  compress: true,

  // Enable React strict mode (dev only, catches potential issues)
  reactStrictMode: true,

  // Experimental features (optional)
  experimental: {
    optimizeCss: true
  },

  // Images optimization (if you're using `next/image`)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // Add this remotePatterns array to allow your S3 bucket
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tngone-image-bucket.s3.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
