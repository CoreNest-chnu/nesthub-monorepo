import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

// 👇 вручну описуємо extractor (без ExtractJwt)
const jwtFromRequest = (req: Request): string | null => {
  const auth = req.headers.authorization

  if (!auth) return null

  const [type, token] = auth.split(' ')

  return type === 'Bearer' ? token : null
}

type JwtPayload = {
  sub: number
  role: string
}

type JwtUser = {
  userId: number
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET')

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
      userId: payload.sub,
      role: payload.role,
    }
  }
}
