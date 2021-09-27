import { hash } from 'argon2'
import { Model } from 'mongoose'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@users/schemas/user.schema'
import { UpdateUserProfileDto } from '@users/dto/update-userProfile.dto'
import { isValidUsername, isValidEmail, isValidPassword } from '@util/validate'

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

  async findForAuth(email: string) {
    return await this.userModel.findOne({ email }, '+password')
  }

  /**
   * Validate user fields. If all are valid, then create new user in database.
   */
  async create(email: string, username: string, password: string) {
    // duplicate email is found
    const existingUser = await this.findByEmail(email)
    if (existingUser && existingUser.verified) {
      throw new BadRequestException('That email is taken. Try another one.')
    }

    // validate username
    if (!isValidUsername(username)) {
      throw new BadRequestException(
        'Username must be between 1 to 30 characters long.'
      )
    }

    // validate email
    if (!isValidEmail(email)) {
      throw new BadRequestException('Invalid email.')
    }

    // validate password
    if (!isValidPassword(password)) {
      throw new BadRequestException(
        'Password must be at least 10 chracters long.'
      )
    }

    // hash password with salt
    const hashedPw = await hash(password)

    return await this.userModel.create({ username, email, password: hashedPw })
  }

  async updateProfile(
    _id: string,
    { username, password, auth }: UpdateUserProfileDto
  ) {
    if (username && !isValidUsername(username)) {
      throw new BadRequestException('Invalid username')
    }

    if (password && !isValidPassword(password)) {
      throw new BadRequestException('Invalid password')
    }

    // hash password with salt
    const hashedPw = await hash(password)

    return await this.userModel.findOneAndUpdate(
      { _id },
      { username, password: hashedPw, auth, modified: new Date() }
    )
  }

  async deleteUser(_id: string) {
    const user = await this.userModel.findOneAndDelete({ _id })
    if (!user) throw new NotFoundException()
    return user
  }

  async getPortfolio(_id: string, season: string) {
    const result = await this.userModel
      .findById(_id, 'portfolio')
      .populate('portfolio.players.player')

    return result.portfolio
  }
}
