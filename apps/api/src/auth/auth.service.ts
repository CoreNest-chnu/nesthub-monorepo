import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { prisma } from "prisma/lib/prisma";
import { hashPassword, signToken } from "./auth.util";
import { UserCreateDTO } from "./dto/user.dto";

@Injectable()
export class AuthService {
  async registerUser(userCreateDto: UserCreateDTO) {
    const hashedPassword = await hashPassword(userCreateDto.password);

    const user = await prisma.user.create({
      data: {
        email: userCreateDto.email.toLowerCase(),
        password: hashedPassword,
        firstName: userCreateDto.firstName,
        lastName: userCreateDto.lastName,
      },
    });

    const payload = { id: user.id, email: user.email, role: user.role };

    const token = signToken(payload);

    return {
      user,
      token,
    };
  }
}
