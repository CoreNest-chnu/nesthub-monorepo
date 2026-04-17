import { IsEmail, MinLength } from "class-validator";

export class UserLoginDTO {
  @IsEmail()
  email!: string;

  @MinLength(2)
  password!: string;
}
