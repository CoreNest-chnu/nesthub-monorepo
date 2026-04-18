import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { compare } from 'bcrypt'
import { PrismaService } from 'prisma/lib/prisma'
import { UserCreateDto, UserLoginDTO } from './dto/user.dto'
import { UserCreateResponseDto, UserLoginResponseDto } from './dto/user.model'
import { hashPassword, signToken } from './util/auth.util'

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

    const existingUser = await this.prisma.user.findUnique({
      where: { email: inputEmail.toLowerCase() },
    })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

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

  async loginUser({
    email,
    password,
  }: UserLoginDTO): Promise<UserLoginResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid email')
    }

    const pepper = process.env.STATIC_SALT

    if (!pepper) {
      throw new Error('STATIC_SALT is not defined')
    }
    const isValid = await compare(password + pepper, user.password)

    if (!isValid) {
      throw new UnauthorizedException('Invalid password')
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return { token }
  }
}
