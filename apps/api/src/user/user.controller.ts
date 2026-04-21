import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserGetProfile, UserService } from './user.service'
import { CurrentUser, User } from './user.util'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() { id }: User): Promise<UserGetProfile> {
    return await this.userService.getMyProfile(id)
  }
}
