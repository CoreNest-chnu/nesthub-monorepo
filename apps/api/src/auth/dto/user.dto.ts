import { IsEmail, IsString, Matches, MinLength } from 'class-validator'

export class UserCreateDTO {
  @IsEmail()
  email: string

  password: string

  firstName: string

  lastName: string
}
