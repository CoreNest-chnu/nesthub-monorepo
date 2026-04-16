import { Injectable } from '@nestjs/common'
import { prisma } from 'prisma/lib/prisma'
import { hashPassword } from './auth.util'
import { UserCreateDTO } from './dto/user.dto'

@Injectable()
export class AuthService {
  async registerUser(userCreateDto: UserCreateDTO) {
    const hashedPassword = await hashPassword(userCreateDto.password)

    const user = await prisma.user.create({
      data: {
        email: userCreateDto.email,
        password: hashedPassword,
        firstName: userCreateDto.firstName,
        lastName: userCreateDto.lastName,
      },
    })

    return {
      user,
      // JWT  TO DEVELOP
    }
  }
}
