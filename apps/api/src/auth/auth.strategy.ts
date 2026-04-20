import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { Role } from 'generated/prisma/enums'
import { UserId } from 'generated/prisma/types'

type JwtPayload = {
  id: UserId
  email: string
  role: Role
}

type JwtUser = {
  userId: UserId
  email: string
  role: Role
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    })
  }

  validate({ id: userId, email, role }: JwtPayload): JwtUser {
    return {
      userId,
      email,
      role,
    }
  }
}
