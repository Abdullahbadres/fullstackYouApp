import { Controller, Get, Post, Put, Body, UseGuards, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger"

import type { ProfilesService } from "./profiles.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import type { CreateProfileDto } from "./dto/create-profile.dto"
import type { UpdateProfileDto } from "./dto/update-profile.dto"

@ApiTags("Profiles")
@Controller("profiles")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req) {
    return this.profilesService.findByUserId(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: "Create user profile" })
  async createProfile(@Req() req, @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(req.user.userId, createProfileDto)
  }

  @Put()
  @ApiOperation({ summary: "Update user profile" })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(req.user.userId, updateProfileDto)
  }
}
