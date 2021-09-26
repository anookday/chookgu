import {
  Controller,
  Body,
  Query,
  Res,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { LocalAuthGuard } from '@auth/local-auth.guard'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { AuthService } from '@auth/auth.service'
import { UsersService } from '@users/users.service'
import { CreateUserProfileDto } from '@users/dto/create-userProfile.dto'
import { UpdateUserProfileDto } from '@users/dto/update-userProfile.dto'
import { User } from '@users/user.decorator'
import { COOKIE_MAX_AGE } from '@util/constants'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User('_id') userId: string, @Res() res: Response) {
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
  async getProfile(@User('_id') userId: string) {
    const { username, email, portfolio, verified } =
      await this.usersService.findById(userId)
    return { username, email, portfolio, verified }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(
    @User('_id') userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
    return await this.usersService.updateOne(userId, updateUserProfileDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/profile')
  async deleteProfile(@User('_id') userId: string) {
    return await this.usersService.deleteOne(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send-confirmation')
  async sendConfirmation(@User('_id') userId: string) {
    return await this.authService.sendVerificationEmail(userId)
  }

  @Post('/verify')
  async verify(@Query('token') token: string, @Res() res: Response) {
    await this.authService.verify(token)
    res.sendStatus(200)
  }
}
