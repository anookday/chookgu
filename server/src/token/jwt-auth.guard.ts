import { Request, Response } from 'express'
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { TokenService } from '@token/token.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly tokenService: TokenService) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()

    const accessToken = request.cookies['access_token']
    if (!accessToken) {
      throw new UnauthorizedException('access token is not set')
    }

    if (await this.tokenService.verifyAccessToken(accessToken)) {
      return this.activate(context)
    }

    const userId = this.tokenService.getAccessTokenUser(accessToken)
    if (!userId) {
      throw new UnauthorizedException('invalid access token')
    }

    const refreshToken: string = request.cookies['refresh_token']
    if (!refreshToken) {
      throw new UnauthorizedException('refresh token is not set')
    }

    const isValidRefreshToken = await this.tokenService.getRefreshToken(
      refreshToken,
      userId
    )
    if (isValidRefreshToken) {
      const newAccessToken = this.tokenService.createAccessToken(userId)
      request.cookies['access_token'] = newAccessToken
      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      return this.activate(context)
    }

    return false
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
