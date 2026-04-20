import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import type { Request } from 'express'

const jwtFromRequest = (req: Request): string | null => {
  const auth = req.headers.authorization

  if (!auth) return null
  const [type, token] = auth.split(' ')

  return type === 'Bearer' ? token : null
}

type JwtPayload = {
  id: number
  email: string
  role: string
}

type JwtUser = {
  userId: number
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secret = process.env.JWT_SECRET

    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }

    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
    }
  }
}
