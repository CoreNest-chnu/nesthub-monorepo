import { Injectable } from "@nestjs/common";
import { prisma } from "prisma/lib/prisma";
import { UserCreateDTO } from "./dto/UserCreateDTO";
import { generateSalt, hashPassword } from "./common";

@Injectable()
export class AuthService {
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

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // JWT  TO DEVELOP
    };
  }
}
