import { type NextRequest, NextResponse } from 'next/server'

// Forwards /api/* to the NestJS backend. This used to be `rewrites()` in
// next.config.js, but rewrites are resolved at build time, so the backend
// address was baked into the Docker image. Here API_PROXY_TARGET is read on
// every request, so one image works with any backend address (docker-compose
// `api:8000`, a Helm release `<release>-api:8000`, or localhost in dev).

// NextAuth's own routes live under /api/auth/*, except these two, which belong
// to the backend.
const backendAuthRoutes = new Set(['/api/auth/register', '/api/auth/login'])

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname.startsWith('/api/auth/') && !backendAuthRoutes.has(pathname)) {
    return NextResponse.next()
  }

  const target = process.env.API_PROXY_TARGET ?? 'http://localhost:8000'

  return NextResponse.rewrite(
    new URL(`${pathname.replace(/^\/api/, '')}${search}`, target),
  )
}

export const config = {
  matcher: '/api/:path*',
}
