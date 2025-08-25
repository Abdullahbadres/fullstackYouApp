import { Injectable, ConflictException } from "@nestjs/common"
import type { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcryptjs"

import type { UsersService } from "../users/users.service"
import type { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailOrUsername(emailOrUsername)

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto

    // Check if user already exists
    const existingUser = await this.usersService.findByEmailOrUsername(email)
    if (existingUser) {
      throw new ConflictException("Email already exists")
    }

    const existingUsername = await this.usersService.findByEmailOrUsername(username)
    if (existingUsername) {
      throw new ConflictException("Username already exists")
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    })

    // Generate JWT token
    const payload = { email: user.email, sub: user._id, username: user.username }
    const access_token = this.jwtService.sign(payload)

    return {
      message: `Account created successfully for ${username}!`,
      access_token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, username: user.username }
    const access_token = this.jwtService.sign(payload)

    return {
      message: `Welcome back, ${user.username}!`,
      access_token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    }
  }
}
