import { Controller, Get, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@auth/jwt-auth.guard'
import { PortfoliosService } from '@portfolios/portfolios.service'
import { User } from '@users/user.decorator'

@Controller('portfolio')
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPortfolio(
    @User('_id') userId: string,
    @Query('season') _season: string
  ) {
    const { season, balance, players } = await this.portfoliosService.get(
      userId,
      _season
    )

    return { season, balance, players }
  }

  @Get('/value')
  @UseGuards(JwtAuthGuard)
  async getValueHistory(
    @User('_id') userId: string,
    @Query('season') season: string
  ) {
    return await this.portfoliosService.getPortfolioValue(userId, season)
  }
}
