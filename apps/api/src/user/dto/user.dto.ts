import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator'
import { Gender } from 'generated/prisma/enums'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsDateString()
  birthDate?: string

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender
}
