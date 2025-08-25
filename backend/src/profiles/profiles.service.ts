import { Injectable, NotFoundException } from "@nestjs/common"
import type { Model } from "mongoose"

import type { Profile, ProfileDocument } from "./schemas/profile.schema"
import type { CreateProfileDto } from "./dto/create-profile.dto"
import type { UpdateProfileDto } from "./dto/update-profile.dto"

@Injectable()
export class ProfilesService {
  constructor(private profileModel: Model<ProfileDocument>) {}

  private calculateZodiacAndHoroscope(birthday: string) {
    const date = new Date(birthday)
    const month = date.getMonth() + 1
    const day = date.getDate()

    const zodiacData = [
      { sign: "Aries", horoscope: "Ram", start: [3, 21], end: [4, 19] },
      { sign: "Taurus", horoscope: "Bull", start: [4, 20], end: [5, 20] },
      { sign: "Gemini", horoscope: "Twins", start: [5, 21], end: [6, 21] },
      { sign: "Cancer", horoscope: "Crab", start: [6, 22], end: [7, 22] },
      { sign: "Leo", horoscope: "Lion", start: [7, 23], end: [8, 22] },
      { sign: "Virgo", horoscope: "Virgin", start: [8, 23], end: [9, 22] },
      { sign: "Libra", horoscope: "Balance", start: [9, 23], end: [10, 23] },
      { sign: "Scorpio", horoscope: "Scorpion", start: [10, 24], end: [11, 21] },
      { sign: "Sagittarius", horoscope: "Archer", start: [11, 22], end: [12, 21] },
      { sign: "Capricorn", horoscope: "Goat", start: [12, 22], end: [1, 19] },
      { sign: "Aquarius", horoscope: "Water Bearer", start: [1, 20], end: [2, 18] },
      { sign: "Pisces", horoscope: "Fish", start: [2, 19], end: [3, 20] },
    ]

    for (const zodiac of zodiacData) {
      const [startMonth, startDay] = zodiac.start
      const [endMonth, endDay] = zodiac.end

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (startMonth > endMonth && ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)))
      ) {
        return { zodiac: zodiac.sign, horoscope: zodiac.horoscope }
      }
    }

    return { zodiac: "", horoscope: "" }
  }

  async create(userId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    const { zodiac, horoscope } = this.calculateZodiacAndHoroscope(createProfileDto.birthday)

    const profileData = {
      ...createProfileDto,
      userId,
      zodiac,
      horoscope,
    }

    const createdProfile = new this.profileModel(profileData)
    return createdProfile.save()
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel.findOne({ userId }).exec()
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    let updateData = { ...updateProfileDto }

    // Recalculate zodiac and horoscope if birthday is updated
    if (updateProfileDto.birthday) {
      const { zodiac, horoscope } = this.calculateZodiacAndHoroscope(updateProfileDto.birthday)
      updateData = { ...updateData, zodiac, horoscope }
    }

    const updatedProfile = await this.profileModel.findOneAndUpdate({ userId }, updateData, { new: true }).exec()

    if (!updatedProfile) {
      throw new NotFoundException("Profile not found")
    }

    return updatedProfile
  }
}
