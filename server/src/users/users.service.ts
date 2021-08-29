import { Model } from 'mongoose'
import {
  Injectable,
  NotFoundException,
  BadGatewayException,
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
    return await this.userModel.findOne({ email }).exec()
  }

  async findById(_id: string) {
    const user = await this.userModel.findById(_id).exec()
    if (!user) throw new NotFoundException()
    return user
  }

  async findOneForAuth(email: string) {
    const user = await this.userModel.findOne({ email }, '+password').exec()
    if (!user) throw new NotFoundException()
    return user
  }

  async create(createUserProfileDto: CreateUserProfileDto) {
    const user = await this.userModel.create(createUserProfileDto)
    if (!user) throw new BadGatewayException()
    return user
  }

  async updateOne(_id: string, updateUserProfileDto: UpdateUserProfileDto) {
    // check for duplicate email
    if (updateUserProfileDto.email) {
      const existingUser = await this.findByEmail(updateUserProfileDto.email)
      if (existingUser && existingUser.id !== _id) {
        throw new BadRequestException()
      }
    }

    const result = await this.userModel
      .updateOne({ _id }, updateUserProfileDto)
      .exec()
    if (!result) throw new BadGatewayException()
    return result
  }

  async deleteOne(_id: string) {
    const user = await this.userModel.findOneAndDelete({ _id }).exec()
    if (!user) throw new NotFoundException()
    return user
  }
}
