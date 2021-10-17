import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@auth/auth.service'
import { LocalStrategy } from '@auth/local.strategy'
import { JwtStrategy } from '@auth/jwt.strategy'
import { Token, TokenSchema } from '@auth/schemas/token.schema'
import { AuthController } from '@auth/auth.controller'
import { MailService } from '@mail/mail.service'
import { PortfoliosModule } from '@portfolios/portfolios.module'
import { UsersModule } from '@users/users.module'
import { COOKIE_MAX_AGE } from '@util/constants'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PortfoliosModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: COOKIE_MAX_AGE + 'ms' },
    }),
  ],
  providers: [AuthService, MailService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
