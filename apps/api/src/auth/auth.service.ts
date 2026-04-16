import { Injectable } from '@nestjs/common'
import { prisma } from 'prisma/lib/prisma'
import { hashPassword, signToken } from './util/auth.util'
import { UserCreateDto } from './dto/user.dto'

@Injectable()
export class AuthService {
  async registerUser({
    email: inputEmail,
    password,
    firstName,
    lastName,
  }: UserCreateDto) {
    const hashedPassword = await hashPassword(password)

    const { id, email, role } = await prisma.user.create({
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
