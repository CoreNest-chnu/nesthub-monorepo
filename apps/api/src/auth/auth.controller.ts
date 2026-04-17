import { Body, Controller, Post } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserCreateDto } from "./dto/register.dto";
import { UserCreateResponseDto } from "./dto/user.model";
import { UserLoginDTO } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiResponse({ status: 201, type: UserCreateResponseDto })
  createUser(
    @Body() userCreateDTO: UserCreateDto,
  ): Promise<UserCreateResponseDto> {
    return this.authService.registerUser(userCreateDTO);
  }

  @Post("login")
  @ApiResponse({ status: 200, type: UserCreateResponseDto })
  loginUser(
    @Body() userLoginDTO: UserLoginDTO,
  ): Promise<UserCreateResponseDto> {
    return this.authService.loginUser(userLoginDTO);
  }
}
