import { Model } from 'mongoose'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@users/schemas/user.schema'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { UpdateUserProfileDto } from '@users/dto/update-userProfile.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  async findById(_id: string) {
    const user = await this.userModel.findById(_id)
    if (!user) throw new NotFoundException()
    return user
  }

  async findOneForAuth(email: string) {
    return await this.userModel.findOne({ email }, '+password')
  }

  async create(createUserProfileDto: CreateUserProfileDto) {
    const existingUser = await this.findByEmail(createUserProfileDto.email)
    if (existingUser) throw new BadRequestException()

    return await this.userModel.create(createUserProfileDto)
  }

  async updateOne(_id: string, updateUserProfileDto: UpdateUserProfileDto) {
    // check for duplicate email
    if (updateUserProfileDto.email) {
      const existingUser = await this.findByEmail(updateUserProfileDto.email)
      if (existingUser && existingUser.id !== _id) {
        throw new BadRequestException()
      }
    }

    return await this.userModel.findOneAndUpdate({ _id }, updateUserProfileDto)
  }

  async deleteOne(_id: string) {
    const user = await this.userModel.findOneAndDelete({ _id })
    if (!user) throw new NotFoundException()
    return user
  }
}
