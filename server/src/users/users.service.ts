import { Model } from 'mongoose'
import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { CreateUserProfileDto } from './dto/create-userProfile.dto'
import { UpdateUserProfileDto } from './dto/update-userProfile.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec()
    return user
  }

  async findById(id: number) {
    const user = await this.userModel.findById(id).exec()
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

  async updateOne(_id: number, updateUserProfileDto: UpdateUserProfileDto) {
    const result = await this.userModel
      .updateOne({ _id }, updateUserProfileDto)
      .exec()
    if (!result) throw new BadGatewayException()
    return result
  }

  async deleteOne(_id: number) {
    const user = await this.userModel.findOneAndDelete({ _id }).exec()
    if (!user) throw new NotFoundException()
    return user
  }
}
