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
import { AuthService } from '@auth/auth.service'
import { TokenService } from '@token/token.service'
import { JwtAuthGuard } from '@token/jwt-auth.guard'
import { User } from '@users/user.decorator'
import { ChangePasswordDto } from './dto/change-password.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@User('_id') userId: string, @Res() res: Response) {
    const refreshToken = await this.tokenService.createRefreshToken(userId)
    const accessToken = this.tokenService.createAccessToken(userId)
    res
      .cookie('refresh_token', refreshToken._id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .sendStatus(200)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.tokenService.deleteToken(req.cookies['refresh_token'])
    res.clearCookie('access_token').clearCookie('refresh_token').sendStatus(200)
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
    const token = await this.tokenService.getPassResetToken(id)
    return {
      active: token !== null,
    }
  }

  @Post('/send-password-reset')
  async sendPasswordReset(@Body('email') email: string, @Req() req: Request) {
    await this.authService.sendResetPasswordEmail(email, req.ip, req.useragent)
  }

  @Post('/reset-password')
  async resetPassword(@Body() { password, token }: ChangePasswordDto) {
    await this.authService.resetPassword(password, token)
  }
}
