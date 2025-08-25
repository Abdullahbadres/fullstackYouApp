import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import type { Document } from "mongoose"

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop({ default: Date.now })
  createdAt: Date

  @Prop({ default: Date.now })
  updatedAt: Date

  @Prop({ default: null })
  lastLogin: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })
UserSchema.index({ createdAt: -1 })
