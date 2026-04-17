import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "prisma/lib/prisma";
import { hashPassword, signToken } from "./util/auth.util";
import { UserCreateDto } from "./dto/register.dto";
import { UserCreateResponseDto } from "./dto/user.model";
import { UserLoginDTO } from "./dto/login.dto";
import { compare } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser({
    email: inputEmail,
    password,
    firstName,
    lastName,
  }: UserCreateDto): Promise<UserCreateResponseDto> {
    const hashedPassword = await hashPassword(password);

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
    });

    const token = signToken({ id, email, role });

    return {
      token,
    };
  }

  async loginUser({
    email,
    password,
  }: UserLoginDTO): Promise<UserCreateResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email");
    }

    const isValid = compare(await hashPassword(password), user.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid password");
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }
}
