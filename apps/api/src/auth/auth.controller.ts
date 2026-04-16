import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserCreateDTO } from "./dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async createUser(@Body() UserCreateDTO: UserCreateDTO) {
    return this.authService.registerUser(UserCreateDTO);
  }
}
