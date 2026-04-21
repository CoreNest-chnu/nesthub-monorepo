import { Injectable, NotFoundException } from '@nestjs/common'
import { User, UserId } from 'generated/prisma/types'
import { PrismaService } from 'prisma/lib/prisma'
import { UpdateUserDto } from './dto/user.dto'

export type UserGetProfile = Omit<User, 'password'>

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

  async updateProfile(
    id: UserId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserGetProfile> {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      omit: {
        password: true,
      },
    })

    return user
  }
}
