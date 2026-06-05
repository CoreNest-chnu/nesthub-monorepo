import { ApiProperty } from '@nestjs/swagger'
import { Gender, Role } from 'generated/prisma/enums'
import type { UserId } from 'generated/prisma/types'

export class UserModel {
  id!: UserId
  email!: string
  firstName!: string
  lastName!: string
  phone!: string | null
  avatar!: string | null
  birthDate!: Date | null

  @ApiProperty({ type: String, enum: Gender, nullable: true })
  gender!: Gender | null

  @ApiProperty({ type: String, enum: Role })
  role!: Role

  updatedAt!: Date
  createdAt!: Date
}

export class UserProfileResponseDto extends UserModel {}
