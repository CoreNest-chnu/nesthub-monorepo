/** @type {import('next').NextConfig} */
const nextConfig = {
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
