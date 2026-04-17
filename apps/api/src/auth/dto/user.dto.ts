import { IsEmail, Matches, MinLength } from "class-validator";

export class UserCreateDto {
  @MinLength(2)
  firstName!: string;

  @MinLength(2)
  lastName!: string;

  @IsEmail()
  email!: string;

  @MinLength(8)
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[0-9]/, { message: "Password must contain at least one digit" })
  password!: string;
}

export class UserLoginDTO {
  @IsEmail()
  email!: string;

  @MinLength(2)
  password!: string;
}
