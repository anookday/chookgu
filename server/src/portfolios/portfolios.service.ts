import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { Player } from '@players/schemas/player.schema'
import {
  Portfolio,
  PortfolioDocument,
} from '@portfolios/schemas/portfolio.schema'

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>
  ) {}

  async get(user: string, season: string) {
    const portfolio = this.portfolioModel.findOne({ user, season })

    if (!portfolio) {
      throw new NotFoundException('Invalid user id or season')
    }

    return portfolio
  }

  async create(user: string, season: string, balance?: number) {
    const existing = await this.get(user, season)
    if (existing) {
      throw new BadRequestException('Portfolio already exists')
    }

    return await this.portfolioModel.create({ user, season, balance })
  }

  async update(user: string, season: string, player: Player, amount: number) {
    // updating 0 of a player does nothing
    if (amount === 0) {
      throw new BadRequestException('Amount cannot be 0')
    }

    // portfolio does not exist
    let portfolio = await this.get(user, season)
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found')
    }

    let asset = portfolio.players.find((p) => p.player === player._id)
    const updateValue = player.currentValue * amount
    const updatedBalance = portfolio.balance - updateValue

    // adding players
    if (amount > 0) {
      // insufficient balance
      if (updatedBalance < 0) {
        throw new BadRequestException('Insufficient balance')
      }
      // owns at least 1 of given player
      if (asset) {
        const updatedAmount = asset.amount + amount
        asset.averageValue =
          (asset.averageValue * asset.amount + updateValue) / updatedAmount
        asset.amount = updatedAmount
      }
      // owns 0 of given player
      else {
        portfolio.players.push({
          player: player._id,
          amount,
          averageValue: player.currentValue,
        })
      }
    }

    // subtracting players
    else {
      // owns 0 of given player
      if (!asset) {
        throw new BadRequestException('Invalid amount of given player')
      }
      const updatedAmount = asset.amount + amount
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
    }

    portfolio.balance -= updateValue

    return await portfolio.save()
  }

  async delete(_id: string, season: string) {
    return await this.portfolioModel.remove({ _id, season })
  }

  // TODO
  async getPortfolioValue(_id: string, season: string) {
    return []
  }
}
