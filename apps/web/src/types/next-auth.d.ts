// To describe next-auth session types
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string
    } & DefaultSession['user']
  }
}
