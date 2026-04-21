import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { Role } from 'generated/prisma/enums'
import { UserId } from 'generated/prisma/types'

export type User = {
  id: UserId
  email: string
  role: Role
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>()

    return request.user
  },
)
