import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserService } from './user.service'
import { CurrentUser, UserGetMe } from './user.util'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @CurrentUser() user: { id: string; email: string; role: string },
  ): Promise<UserGetMe> {
    return await this.userService.getMe(user.id)
  }
}
