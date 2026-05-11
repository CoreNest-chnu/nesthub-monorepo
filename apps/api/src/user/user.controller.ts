import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/auth.guard'
import { UserGetProfile, UserService } from './user.service'
import { CurrentUser, User } from './user.util'
import { UpdateUserDto } from './dto/user.dto'
import { UserProfileResponseDto } from './dto/user.model'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: UserProfileResponseDto })
  async getMe(@CurrentUser() { id }: User): Promise<UserGetProfile> {
    return await this.userService.get(id)
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 200, type: UserProfileResponseDto })
  async updateUser(
    @CurrentUser() { id }: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserGetProfile> {
    return await this.userService.update({ id, data: updateUserDto })
  }
}
