import { fileURLToPath } from 'node:url'

// /api/* is proxied to the backend at runtime by src/proxy.ts (API_PROXY_TARGET).

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
}

export default nextConfig
