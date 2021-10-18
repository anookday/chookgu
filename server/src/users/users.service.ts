import { hash } from 'argon2'
import { Model } from 'mongoose'
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
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

    // create user in database
    const newUser = await this.userModel.create({
      username,
      email,
      password: hashedPw,
    })

    if (!newUser) {
      throw new InternalServerErrorException('Failed to create new user')
    }

    return newUser
  }

  async updateProfile(
    _id: string,
    { username, password }: UpdateUserProfileDto
  ) {
    if (username !== undefined && !isValidUsername(username)) {
      throw new BadRequestException('Invalid username')
    }

    if (password !== undefined && !isValidPassword(password)) {
      throw new BadRequestException('Invalid password')
    }

    let user = await this.userModel.findById(_id)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (username) {
      user.username = username
    }

    if (password) {
      user.password = await hash(password)
    }

    user.modified = new Date()

    return await user.save()
  }

  async deleteUser(_id: string) {
    const user = await this.userModel.findOneAndDelete({ _id })
    if (!user) throw new NotFoundException()
    return user
  }
}
