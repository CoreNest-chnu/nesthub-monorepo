import { ApiProperty } from '@nestjs/swagger'
import { Role, type UserId } from 'generated/prisma/types'

export class UserCreateResponseDto {
  @ApiProperty({ type: String })
  id!: UserId
  token!: string

  @ApiProperty({ type: String, enum: Role })
  role!: Role
}

export class UserLoginResponseDto extends UserCreateResponseDto {}
