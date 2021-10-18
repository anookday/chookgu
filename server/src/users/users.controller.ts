import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { User } from '@users/user.decorator'
import { UsersService } from '@users/users.service'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { UpdateUserProfileDto } from '@users/dto/update-userProfile.dto'

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async createProfile(
    @Body() { email, username, password }: CreateUserProfileDto
  ) {
    return await this.usersService.create(email, username, password)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@User('_id') userId: string) {
    const { username, email, verified, auth } =
      await this.usersService.findById(userId)
    return { username, email, verified, auth }
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateProfile(
    @User('_id') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
    const { username, email, verified, auth } =
      await this.usersService.updateProfile(userId, updateUserProfileDto)
    return { username, email, verified, auth }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteProfile(@User('_id') userId: string) {
    return await this.usersService.deleteUser(userId)
  }
}
