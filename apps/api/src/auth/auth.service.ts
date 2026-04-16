import { Injectable } from "@nestjs/common";
import { prisma } from "prisma/lib/prisma";
import { UserCreateDTO } from "./dto/UserCreateDTO";
import { generateSalt, hashPassword } from "./common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async registerUser(userCreateDto: UserCreateDTO) {
    const salt = await generateSalt();

    const hashedPassword = await hashPassword(userCreateDto.password, salt);

    const user = await prisma.user.create({
      data: {
        email: userCreateDto.email,
        password: hashedPassword,
        firstName: userCreateDto.firstName,
        lastName: userCreateDto.lastName,
      },
    });

    const token = await this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    };
  }
}
