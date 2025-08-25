import { Test, type TestingModule } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { ConflictException, UnauthorizedException } from "@nestjs/common"
import * as bcrypt from "bcryptjs"
import { jest } from "@jest/globals"

import { AuthService } from "./auth.service"
import { UsersService } from "../users/users.service"

// Mock bcrypt
jest.mock("bcryptjs")
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe("AuthService", () => {
  let service: AuthService
  let usersService: jest.Mocked<UsersService>
  let jwtService: jest.Mocked<JwtService>

  const mockUser = {
    _id: "507f1f77bcf86cd799439011",
    email: "test@example.com",
    username: "testuser",
    password: "hashedpassword",
    toObject: () => ({ email: "test@example.com", username: "testuser" }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailOrUsername: jest.fn(),
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get(UsersService)
    jwtService = module.get(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("register", () => {
    const registerDto = {
      email: "test@example.com",
      username: "testuser",
      password: "MyPass1!",
    }

    it("should successfully register a new user", async () => {
      usersService.findByEmailOrUsername.mockResolvedValue(null)
      mockedBcrypt.hash.mockResolvedValue("hashedpassword")
      usersService.create.mockResolvedValue(mockUser as any)
      jwtService.sign.mockReturnValue("jwt-token")

      const result = await service.register(registerDto)

      expect(usersService.findByEmailOrUsername).toHaveBeenCalledWith(registerDto.email, registerDto.username)
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12)
      expect(usersService.create).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        password: "hashedpassword",
      })
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
      })
      expect(result).toEqual({
        access_token: "jwt-token",
        user: {
          id: mockUser._id,
          email: mockUser.email,
          username: mockUser.username,
        },
      })
    })

    it("should throw ConflictException if user already exists", async () => {
      usersService.findByEmailOrUsername.mockResolvedValue(mockUser as any)

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException)
    })
  })

  describe("login", () => {
    const loginDto = {
      email: "test@example.com",
      password: "MyPass1!",
    }

    it("should successfully login with email", async () => {
      usersService.findByEmailOrUsername.mockResolvedValue(mockUser as any)
      mockedBcrypt.compare.mockResolvedValue(true)
      jwtService.sign.mockReturnValue("jwt-token")

      const result = await service.login(loginDto)

      expect(usersService.findByEmailOrUsername).toHaveBeenCalledWith(loginDto.email, undefined)
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password)
      expect(result).toEqual({
        access_token: "jwt-token",
        user: {
          id: mockUser._id,
          email: mockUser.email,
          username: mockUser.username,
        },
      })
    })

    it("should successfully login with username", async () => {
      const loginWithUsername = { username: "testuser", password: "MyPass1!" }
      usersService.findByEmailOrUsername.mockResolvedValue(mockUser as any)
      mockedBcrypt.compare.mockResolvedValue(true)
      jwtService.sign.mockReturnValue("jwt-token")

      const result = await service.login(loginWithUsername)

      expect(usersService.findByEmailOrUsername).toHaveBeenCalledWith(undefined, loginWithUsername.username)
    })

    it("should throw UnauthorizedException if user not found", async () => {
      usersService.findByEmailOrUsername.mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it("should throw UnauthorizedException if password is invalid", async () => {
      usersService.findByEmailOrUsername.mockResolvedValue(mockUser as any)
      mockedBcrypt.compare.mockResolvedValue(false)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe("validateUser", () => {
    it("should return user without password if credentials are valid", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any)
      mockedBcrypt.compare.mockResolvedValue(true)

      const result = await service.validateUser("test@example.com", "password")

      expect(result).toEqual({ email: "test@example.com", username: "testuser" })
    })

    it("should return null if user not found", async () => {
      usersService.findByEmail.mockResolvedValue(null)

      const result = await service.validateUser("test@example.com", "password")

      expect(result).toBeNull()
    })

    it("should return null if password is invalid", async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any)
      mockedBcrypt.compare.mockResolvedValue(false)

      const result = await service.validateUser("test@example.com", "password")

      expect(result).toBeNull()
    })
  })
})
