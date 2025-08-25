import { Controller, Get, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"

import type { UsersService } from "./users.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { Request } from "express"

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  getProfile(req: Request) {
    return this.usersService.findById(req.user.userId)
  }
}
