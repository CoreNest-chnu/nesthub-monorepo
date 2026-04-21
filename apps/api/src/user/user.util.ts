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
  (_: unknown, ctx: ExecutionContext): User => {
    return ctx.switchToHttp().getRequest<Request & { user: User }>().user
  },
)
