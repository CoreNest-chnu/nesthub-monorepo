import { SetMetadata } from '@nestjs/common'
import { Role } from 'generated/prisma/enums'

export const Roles = (...roles: Role[]): MethodDecorator & ClassDecorator =>
  SetMetadata('roles', roles)
