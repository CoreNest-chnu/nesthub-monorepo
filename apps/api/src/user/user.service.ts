import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from 'generated/prisma/types'
import { PrismaService } from 'prisma/lib/prisma'

export type UserGetProfile = Pick<
  User,
  | 'id'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'role'
  | 'avatar'
  | 'phone'
  | 'birthDate'
  | 'gender'
  | 'createdAt'
>

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(id: string): Promise<UserGetProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        phone: true,
        birthDate: true,
        gender: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }
}
