import { IsEmail, IsString, MinLength, MaxLength, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class RegisterDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Please enter a valid email address" })
  email: string

  @ApiProperty({
    description: "Username (3-20 characters)",
    example: "johndoe",
  })
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(20, { message: "Username must not exceed 20 characters" })
  username: string

  @ApiProperty({
    description: "Password (6-9 characters, must contain uppercase, number, and symbol)",
    example: "MyPass1!",
  })
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(9, { message: "Password must not exceed 9 characters" })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/, {
    message: "Password must contain at least 1 uppercase letter, 1 number, and 1 symbol",
  })
  password: string
}
