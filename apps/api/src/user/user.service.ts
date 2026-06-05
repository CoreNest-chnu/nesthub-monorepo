import { Injectable, NotFoundException } from '@nestjs/common'
import type { User, UserId } from 'generated/prisma/types'
import { PrismaService } from 'prisma/lib/prisma'
import { UpdateUserDto } from './dto/user.dto'

export type UserGetProfile = Omit<User, 'password'>

type UpdateProfileArgs = {
  id: UserId
  data: UpdateUserDto
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async get(id: UserId): Promise<UserGetProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: {
        password: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  update({ id, data }: UpdateProfileArgs): Promise<UserGetProfile> {
    return this.prisma.user.update({
      where: { id },
      data,
      omit: {
        password: true,
      },
    })
  }
}
