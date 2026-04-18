import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/lib/prisma'
import { hashPassword, signToken } from './util/auth.util'
import { UserCreateDto } from './dto/user.dto'
import { UserCreateResponseDto } from './dto/user.model'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser({
    email: inputEmail,
    password,
    firstName,
    lastName,
  }: UserCreateDto): Promise<UserCreateResponseDto> {
    const hashedPassword = await hashPassword(password)

    const { id, email, role } = await this.prisma.user.create({
      data: {
        email: inputEmail.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    })

    const token = signToken({ id, email, role })

    return {
      token,
    }
  }
}
