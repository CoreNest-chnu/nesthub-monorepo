import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

type JwtUser = {
  role?: string
  data?: {
    role?: string
  }
}

type RequestWithUser = Request & {
  user?: JwtUser
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest<Request>()

    const apiKeyHeader = request.headers['api-key']
    const validApiKey = process.env.API_KEY

    if (typeof apiKeyHeader !== 'string' || apiKeyHeader !== validApiKey) {
      throw new ForbiddenException('Invalid API key')
    }

    return true
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    )

    const request = context.switchToHttp().getRequest<RequestWithUser>()

    const user = request.user

    if (!user) {
      throw new UnauthorizedException('User is not authorized')
    }

    const userRole = user.role ?? user.data?.role

    if (!userRole) {
      throw new ForbiddenException('Role not found')
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission')
    }

    return true
  }
}
