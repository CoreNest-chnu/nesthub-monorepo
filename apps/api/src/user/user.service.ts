import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from 'generated/prisma/types'
import { PrismaService } from 'prisma/lib/prisma'

export type UserGetProfile = Omit<User, 'password'>

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(id: string): Promise<UserGetProfile> {
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
}
