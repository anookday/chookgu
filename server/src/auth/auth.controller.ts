import {
  Controller,
  Body,
  Res,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtAuthGuard } from './jwt-auth.guard'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { CreateUserProfileDto } from '../users/dto/create-userProfile.dto'
import { UpdateUserProfileDto } from '../users/dto/update-userProfile.dto'
import { User } from '../users/user.decorator'
import { Response } from 'express'
import { COOKIE_MAX_AGE } from '../util/constants'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User('_id') userId: number, @Res() res: Response) {
    const jwt = this.authService.login(userId)
    res
      .cookie('access_token', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE,
      })
      .send('Logged in successfully')
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token').send('Logged out successfully')
  }

  /* TODO: add guard/middleware that verifies that user has confirmed account creation over email */
  @Post('/profile')
  async createProfile(@Body() createUserProfileDto: CreateUserProfileDto) {
    return await this.authService.register(createUserProfileDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@User('_id') userId: number) {
    return await this.usersService.findById(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(
    @User('_id') userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
    return await this.usersService.updateOne(userId, updateUserProfileDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/profile')
  async deleteProfile(@User('_id') userId: number) {
    return await this.usersService.deleteOne(userId)
  }
}
