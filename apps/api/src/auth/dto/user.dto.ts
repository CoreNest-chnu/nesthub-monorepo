import { IsEmail } from 'class-validator'

export class UserCreateDto {
  @IsEmail()
  email!: string
  password!: string
  firstName!: string
  lastName!: string
}
