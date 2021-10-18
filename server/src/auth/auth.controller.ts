import { Request, Response } from 'express'
import {
  Controller,
  Body,
  Query,
  Req,
  Res,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from '@auth/local-auth.guard'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { AuthService } from '@auth/auth.service'
import { User } from '@users/user.decorator'
import { COOKIE_MAX_AGE } from '@util/constants'
import { ChangePasswordDto } from './dto/change-password.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    res.clearCookie('access_token').sendStatus(200)
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

  @Get('/pw-token-status')
  async getPasswordTokenStatus(@Query('token') id: string) {
    const token = await this.authService.getToken(id, 'pw-reset')
    return {
      active: token !== null,
    }
  }

  @Post('/send-password-reset')
  async sendPasswordReset(@Query('email') email: string, @Req() req: Request) {
    await this.authService.sendResetPasswordEmail(email, req.ip, req.useragent)
  }

  @Post('/reset-password')
  async resetPassword(@Body() { password, token }: ChangePasswordDto) {
    await this.authService.resetPassword(password, token)
  }
}
