import { Injectable, NotFoundException } from "@nestjs/common"
import type { Model } from "mongoose"

import type { User, UserDocument } from "./schemas/user.schema"
import type { CreateUserDto } from "./dto/create-user.dto"

@Injectable()
export class UsersService {
  private userModel: Model<UserDocument>

  constructor(userModel: Model<UserDocument>) {
    this.userModel = userModel
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    return createdUser.save()
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select("-password").exec()
    if (!user) {
      throw new NotFoundException("User not found")
    }
    return user
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    return this.userModel
      .findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      })
      .exec()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select("-password").exec()
  }
}
