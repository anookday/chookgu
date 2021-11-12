import { Model, Types } from 'mongoose'
import { format } from 'date-fns'
import { InjectModel } from '@nestjs/mongoose'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { PlayersService } from '@players/players.service'
import { isPlayerDocument } from '@players/schemas/player.schema'
import {
  Portfolio,
  PortfolioDocument,
} from '@portfolios/schemas/portfolio.schema'
import { PortfolioValueDto } from '@portfolios/dto/portfolio-value.dto'
import { TransactionsService } from '@transactions/transactions.service'
import {
  Transaction,
  TransactionType,
  TransactionDocument,
} from '@transactions/schemas/transaction.schema'
import { UsersService } from '@users/users.service'

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
    private playersService: PlayersService,
    private transactionsService: TransactionsService
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

  async buyPlayer(
    season: string,
    userId: string,
    playerId: number,
    amount: number
  ) {
    let user = await this.usersService.findById(userId)
    const player = await this.playersService.findById(playerId)

    if (!user) {
      throw new BadRequestException('Invalid user')
    }
    if (!player) {
      throw new BadRequestException('Invalid player')
    }
    if (amount < 1) {
      throw new BadRequestException('Invalid amount')
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

    // update portfolio
    portfolio.balance -= updateValue
    portfolio = await portfolio.save()

    // add new transaction record
    await this.transactionsService.add(
      user._id,
      player._id,
      season,
      TransactionType.Buy,
      amount,
      player.currentValue
    )

    return portfolio
  }

  async sellPlayer(
    season: string,
    userId: string,
    playerId: number,
    amount: number
  ) {
    let user = await this.usersService.findById(userId)
    const player = await this.playersService.findById(playerId)

    if (!user) {
      throw new BadRequestException('Invalid user')
    }
    if (!player) {
      throw new BadRequestException('Invalid player')
    }
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

    // update portfolio
    portfolio.balance += player.currentValue * amount
    portfolio = await portfolio.save()

    // add new transaction record
    await this.transactionsService.add(
      user._id,
      player._id,
      season,
      TransactionType.Sell,
      amount,
      player.currentValue
    )

    return portfolio.populate('players.player')
  }

  async delete(user: string, season: string) {
    return await this.portfolioModel.remove({ user, season })
  }

  /**
   * Get date/value pairs that represent a user's historical portfolio value.
   */
  async getPortfolioValue(userId: string, season: string) {
    const portfolio = await this.get(userId, season)

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

  /**
   * Get date/value pairs that represent a user's overall gain/loss values
   * over their investing lifetime.
   */
  async getGainLoss(userId: string, season: string) {
    type GainLossValue = {
      _id: {
        year: number
        month: number
        day: number
      }
      value: number
    }

    const query = await this.transactionModel.aggregate<GainLossValue>([
      {
        $match: {
          user: Types.ObjectId(userId),
          season,
        },
      },
      {
        $lookup: {
          from: 'players',
          localField: 'player',
          foreignField: '_id',
          as: 'player',
        },
      },
      {
        $unwind: '$player',
      },
      {
        $addFields: {
          gains: {
            $map: {
              input: {
                $filter: {
                  input: '$player.value',
                  as: 'v',
                  cond: {
                    $gte: ['$$v.date', '$date'],
                  },
                },
              },
              as: 'playerValue',
              in: {
                player: '$player._id',
                year: {
                  $year: '$$playerValue.date',
                },
                month: {
                  $month: '$$playerValue.date',
                },
                day: {
                  $dayOfMonth: '$$playerValue.date',
                },
                amount: {
                  $cond: {
                    if: { $eq: ['$type', 'buy'] },
                    then: '$amount',
                    else: { $subtract: [0, '$amount'] },
                  },
                },
                assetValue: {
                  $cond: {
                    if: { $eq: ['$type', 'buy'] },
                    then: '$$playerValue.amount',
                    else: 0,
                  },
                },
                balance: {
                  $cond: {
                    if: { $eq: ['$type', 'buy'] },
                    then: {
                      $multiply: ['$price', { $subtract: [0, '$amount'] }],
                    },
                    else: {
                      $multiply: ['$price', '$amount'],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $unwind: '$gains',
      },
      {
        $group: {
          _id: {
            player: '$gains.player',
            year: '$gains.year',
            month: '$gains.month',
            day: '$gains.day',
          },
          amount: {
            $sum: '$gains.amount',
          },
          gain: {
            $sum: '$gains.assetValue',
          },
          balance: {
            $sum: '$gains.balance',
          },
        },
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          gain: 1,
          balance: 1,
        },
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
          },
          value: {
            $sum: {
              $add: [{ $multiply: ['$amount', '$gain'] }, '$balance'],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          value: 1,
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ])

    return query.map((v) => {
      return {
        date: new Date(v._id.year, v._id.month - 1, v._id.day),
        value: v.value,
      }
    })
  }
}
