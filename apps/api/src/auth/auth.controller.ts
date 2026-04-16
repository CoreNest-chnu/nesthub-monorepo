import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UserCreateDto } from './dto/user.dto'
import { UserCreateResponseDto } from './dto/user.model'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(
    @Body() userCreateDTO: UserCreateDto,
  ): Promise<UserCreateResponseDto> {
    return this.authService.registerUser(userCreateDTO)
  }
}
