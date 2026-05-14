import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      root: path.resolve(__dirname, '../..'),
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
    ],
  },
  async rewrites() {
    return {
      // Run BEFORE the filesystem — these paths never reach the
      // /api/auth/[...nextauth] catch-all route.
      beforeFiles: [
        {
          source: '/api/auth/register',
          destination: 'http://localhost:8000/auth/register',
        },
        {
          source: '/api/auth/login',
          destination: 'http://localhost:8000/auth/login',
        },
      ],
      afterFiles: [],
      // Everything else under /api/* that doesn't match a local route
      // falls through to the NestJS backend.
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        },
      ],
    }
  },
}

export default nextConfig
