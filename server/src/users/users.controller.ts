import { Controller, Get, UseGuards, Query } from '@nestjs/common'
import { UsersService } from '@users/users.service'

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}
}
