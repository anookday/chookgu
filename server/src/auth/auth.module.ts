import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from '@auth/auth.service'
import { LocalStrategy } from '@auth/local.strategy'
import { AuthController } from '@auth/auth.controller'
import { MailService } from '@mail/mail.service'
import { PortfoliosModule } from '@portfolios/portfolios.module'
import { TokenModule } from '@token/token.module'
import { JwtStrategy } from '@token/jwt.strategy'
import { UsersModule } from '@users/users.module'

@Module({
  imports: [UsersModule, PassportModule, PortfoliosModule, TokenModule],
  providers: [AuthService, MailService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
