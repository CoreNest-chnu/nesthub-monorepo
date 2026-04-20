import NextAuth from 'next-auth'
import { authOptions } from '@/src/lib/auth'

const { handlers } = NextAuth(authOptions)

export function GET(request: Request): Promise<Response> {
  // next-auth v5 beta types `NextRequest` from a transitively-resolved copy of
  // `next`; Next 16's route validator compares against the top-level copy and
  // rejects the brand mismatch. At runtime they're the same object shape.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return handlers.GET(request as never)
}

export function POST(request: Request): Promise<Response> {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return handlers.POST(request as never)
}
