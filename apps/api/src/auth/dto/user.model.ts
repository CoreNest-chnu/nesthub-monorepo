import { ApiProperty } from '@nestjs/swagger'
import { Role, UserId } from 'generated/prisma/types'

export class UserCreateResponseDto {
  id!: UserId
  token!: string

  @ApiProperty({ type: String, enum: Role })
  role!: Role
}

export class UserLoginResponseDto extends UserCreateResponseDto {}
