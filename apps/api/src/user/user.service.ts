import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { UserGetMe } from './user.util'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(id: string): Promise<UserGetMe> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }
}
