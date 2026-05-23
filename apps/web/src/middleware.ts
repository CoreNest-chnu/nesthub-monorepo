import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })

  if (token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
