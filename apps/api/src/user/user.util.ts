import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { UserId } from 'generated/prisma/types'

export type UserGetMe = {
  id: UserId
  firstName: string
  lastName: string
  email: string
  phone: string | null
  createdAt: Date
}

type User = {
  userId: string
  email: string
  role: string
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>()

    return request.user
  },
)
