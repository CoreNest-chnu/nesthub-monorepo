import { ApiProperty } from '@nestjs/swagger'
import { Gender } from 'generated/prisma/enums'

export class UpdateUserDto {
  firstName?: string

  lastName?: string

  phone?: string

  avatar?: string

  birthDate?: Date

  @ApiProperty({ type: String, enum: Gender })
  gender?: Gender
}
