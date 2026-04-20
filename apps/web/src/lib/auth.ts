// We need this eslint disable comment to declare the module augmentation
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { DefaultSession, NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: { id: string; role: string } & DefaultSession['user']
  }

  interface User {
    token?: string
    role?: string
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    jwt: string
    role: string
  }
}

export const authOptions: NextAuthConfig = {
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60, updateAge: 0 },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        id: { label: 'Id', type: 'text' },
        token: { label: 'Token', type: 'text' },
        role: { label: 'Role', type: 'text' },
      },
      authorize: ({ id, token, role }) => {
        const authorizeId = typeof id === 'string' ? id : null
        const authorizeToken = typeof token === 'string' ? token : null
        const authorizeRole = typeof role === 'string' ? role : null

        if (!authorizeId || !authorizeToken || !authorizeRole) {
          return null
        }

        return { id: authorizeId, role: authorizeRole, token: authorizeToken }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user, account }) => {
      if (account && user.token && user.id && user.role) {
        token.id = user.id
        token.jwt = user.token
        token.role = user.role
      }

      return token
    },
    session: ({ session, token }) => {
      session.accessToken = token.jwt
      session.user.id = token.id
      session.user.role = token.role

      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
