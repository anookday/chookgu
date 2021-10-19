import { Model, Types } from 'mongoose'
import { parseISO, format } from 'date-fns'
import { InjectModel } from '@nestjs/mongoose'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { Player, isPlayerDocument } from '@players/schemas/player.schema'
import {
  Portfolio,
  PortfolioDocument,
} from '@portfolios/schemas/portfolio.schema'
import { PortfolioValueDto } from '@portfolios/dto/portfolio-value.dto'

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>
  ) {}

  async get(user: string, season: string) {
    const portfolio = await this.portfolioModel
      .findOne({ user, season })
      .populate('players.player')

    if (!portfolio) {
      throw new NotFoundException('Invalid user id or season')
    }

    return portfolio
  }

  async create(user: string, season: string, balance?: number) {
    const existing = await this.portfolioModel.findOne({ user, season })
    if (existing) {
      throw new BadRequestException('Portfolio already exists')
    }

    return await this.portfolioModel.create({ user, season, balance })
  }

  async addPlayer(
    user: string,
    season: string,
    player: Player,
    amount: number
  ) {
    if (amount < 1) {
      throw new BadRequestException('Amount must be a positive integer')
    }

    // portfolio does not exist
    let portfolio = await this.portfolioModel.findOne({ user, season })
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found')
    }

    const updateValue = player.currentValue * amount
    const updatedBalance = portfolio.balance - updateValue

    // insufficient balance
    if (updatedBalance < 0) {
      throw new BadRequestException('Insufficient balance')
    }

    let asset = portfolio.players.find((p) => p.player === player._id)
    // owns at least 1 of given player
    if (asset) {
      asset.averageValue =
        (asset.averageValue * asset.amount + updateValue) /
        (asset.amount + amount)
      asset.amount += amount
    }
    // owns 0 of given player
    else {
      portfolio.players.push({
        player: player._id,
        amount,
        averageValue: player.currentValue,
      })
    }

    portfolio.balance -= updateValue

    return await portfolio.save()
  }

  async removePlayer(
    user: string,
    season: string,
    player: Player,
    amount: number
  ) {
    if (amount < 1) {
      throw new BadRequestException('Amount must be a positive integer')
    }

    // portfolio does not exist
    let portfolio = await this.portfolioModel.findOne({ user, season })
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found')
    }

    let asset = portfolio.players.find((p) => p.player === player._id)
    // owns 0 of given player
    if (!asset) {
      throw new BadRequestException('Player asset not found')
    }
    const updatedAmount = asset.amount - amount
    // does not own given amount of players
    if (updatedAmount < 0) {
      throw new BadRequestException('Insufficient player assets')
    }
    // if update results in 0 assets, remove the asset object from document
    if (updatedAmount === 0) {
      portfolio.players = portfolio.players.filter(
        (p) => p.player !== player._id
      )
    }
    // otherwise, update asset's amount
    else {
      asset.amount = updatedAmount
    }

    portfolio.balance += player.currentValue * amount

    return await portfolio.save()
  }

  async delete(user: string, season: string) {
    return await this.portfolioModel.remove({ user, season })
  }

  async getPortfolioValue(user: string, season: string) {
    const portfolio = await this.get(user, season)

    let result: PortfolioValueDto[] = []

    for (let asset of portfolio.players) {
      if (!isPlayerDocument(asset.player)) continue

      for (let playerValue of asset.player.value) {
        const date = format(playerValue.date, 'yyyy-MM-dd')
        const value = playerValue.amount * asset.amount

        let obj = result.find((o) => o.date === date)

        if (obj) {
          obj.value += value
        } else {
          result.push({ date, value: value + portfolio.balance })
        }
      }
    }

    return result
  }
}
