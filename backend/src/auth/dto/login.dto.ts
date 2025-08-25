import { IsString, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
  @ApiProperty({
    description: "Email or username",
    example: "user@example.com",
  })
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string

  @ApiProperty({
    description: "User password",
    example: "MyPass1!",
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
