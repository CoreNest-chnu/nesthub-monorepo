import { Injectable, NotFoundException } from '@nestjs/common'
import { User, UserId } from 'generated/prisma/types'
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

  async getMyProfile(id: UserId): Promise<UserGetProfile> {
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

  updateProfile({ id, data }: UpdateProfileArgs): Promise<UserGetProfile> {
    return this.prisma.user.update({
      where: { id },
      data,
      omit: {
        password: true,
      },
    })
  }
}
