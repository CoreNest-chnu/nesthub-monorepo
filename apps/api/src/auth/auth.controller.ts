import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserCreateDTO } from "./dto/UserCreateDTO";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async createUser(@Body() dto: UserCreateDTO) {
    return this.authService.registerUser(dto);
  }
}
