import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { UsersService } from '@users/users.service'
import { User } from '@users/user.decorator'

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/portfolio')
  async getPortfolio(@User('_id') userId: string) {
    return await this.usersService.getPortfolio(userId)
  }
}
