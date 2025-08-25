import { Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"

import type { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import type { RegisterDto } from "./dto/register.dto"

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "User already exists" })
  async register(registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
