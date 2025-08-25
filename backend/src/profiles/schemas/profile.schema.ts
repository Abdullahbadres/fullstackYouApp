import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { type Document, Types } from "mongoose"

export type ProfileDocument = Profile & Document

@Schema({ timestamps: true })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: "User", required: true, unique: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  birthday: string

  @Prop({ required: true, enum: ["male", "female"] })
  gender: string

  @Prop({ required: true })
  height: number

  @Prop({ required: true })
  weight: number

  @Prop({ type: [String], default: [] })
  interests: string[]

  @Prop({ default: "" })
  profileImage: string

  @Prop({ default: "cm", enum: ["cm", "ft"] })
  heightUnit: string

  @Prop({ default: 0 })
  heightFeet: number

  @Prop({ default: 0 })
  heightInches: number

  @Prop({ default: "" })
  zodiac: string

  @Prop({ default: "" })
  horoscope: string
}

export const ProfileSchema = SchemaFactory.createForClass(Profile)

// Indexes
ProfileSchema.index({ userId: 1 })
ProfileSchema.index({ interests: 1 })
ProfileSchema.index({ zodiac: 1 })
