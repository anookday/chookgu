import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from '@auth/auth.service'
import { LocalStrategy } from '@auth/local.strategy'
import { JwtStrategy } from '@auth/jwt.strategy'
import { AuthController } from '@auth/auth.controller'
import { UsersModule } from '@users/users.module'
import { COOKIE_MAX_AGE } from '@util/constants'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: COOKIE_MAX_AGE + 'ms' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
