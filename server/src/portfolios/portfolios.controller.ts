import {
  Controller,
  Get,
  Post,
  UsePipes,
  UseGuards,
  Query,
  Body,
  ValidationPipe,
} from '@nestjs/common'
import { PortfoliosService } from '@portfolios/portfolios.service'
import { JwtAuthGuard } from '@token/jwt-auth.guard'
import { TransactionDto } from '@transactions/dto/transaction.dto'
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

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/buy')
  async buy(
    @User('_id') userId: string,
    @Body() { season, playerId, amount }: TransactionDto
  ) {
    const portfolio = await this.portfoliosService.buyPlayer(
      season,
      userId,
      playerId,
      amount
    )

    return await portfolio.populate('players.player').execPopulate()
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/sell')
  async sell(
    @User('_id') userId: string,
    @Body() { season, playerId, amount }: TransactionDto
  ) {
    const portfolio = await this.portfoliosService.sellPlayer(
      season,
      userId,
      playerId,
      amount
    )

    return await portfolio.populate('players.player').execPopulate()
  }

  @Get('/value')
  @UseGuards(JwtAuthGuard)
  async getValueHistory(
    @User('_id') userId: string,
    @Query('season') season: string
  ) {
    return await this.portfoliosService.getPortfolioValue(userId, season)
  }

  @Get('/gain-loss')
  @UseGuards(JwtAuthGuard)
  async getGainLossHistory(
    @User('_id') userId: string,
    @Query('season') season: string
  ) {
    return await this.portfoliosService.getGainLoss(userId, season)
  }
}
