import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserGetProfile, UserService } from './user.service'
import { CurrentUser, User } from './user.util'
import { UpdateUserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() { id }: User): Promise<UserGetProfile> {
    return await this.userService.getMyProfile(id)
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() { id }: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserGetProfile> {
    return await this.userService.updateProfile({ id, data: updateUserDto })
  }
}
