import { fileURLToPath } from 'node:url'

// Where the Next server proxies /api/* requests. In Docker the API is reachable
// via the compose service name (http://api:8000); locally it's localhost:8000.
const API_PROXY_TARGET = process.env.API_PROXY_TARGET ?? 'http://localhost:8000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server build for the production Docker image. Tracing root is
  // the monorepo root so workspace packages and hoisted node_modules are included.
  output: 'standalone',
  outputFileTracingRoot: fileURLToPath(new URL('../../', import.meta.url)),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
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
          destination: `${API_PROXY_TARGET}/auth/register`,
        },
        {
          source: '/api/auth/login',
          destination: `${API_PROXY_TARGET}/auth/login`,
        },
      ],
      afterFiles: [],
      // Everything else under /api/* that doesn't match a local route
      // falls through to the NestJS backend.
      fallback: [
        {
          source: '/api/:path*',
          destination: `${API_PROXY_TARGET}/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
