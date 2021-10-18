import { Model, Types } from 'mongoose'
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionDocument,
  TransactionType,
} from '@transactions/schemas/transaction.schema'
import { UsersService } from '@users/users.service'
import { PlayersService } from '@players/players.service'
import { PortfoliosService } from '@portfolios/portfolios.service'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
    private playersService: PlayersService,
    private portfoliosService: PortfoliosService
  ) {}

  async getUserTransactions(userId: string, index: number) {
    return this.transactionModel
      .find({ user: userId })
      .sort({ user: 1, date: -1 })
      .skip(index)
      .limit(10)
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

    // update portfolio associated with selected user and season
    const portfolio = await this.portfoliosService.addPlayer(
      userId,
      season,
      player,
      amount
    )

    if (!portfolio) {
      throw new InternalServerErrorException('Failed to update portfolio')
    }

    // add new transaction record
    const transaction = await this.transactionModel.create({
      user: Types.ObjectId(userId),
      player: playerId,
      mode: season,
      type: TransactionType.Buy,
      price: player.currentValue,
      amount,
    })

    if (!transaction) {
      throw new InternalServerErrorException('Failed to create transaction')
    }

    return portfolio.populate('players.player')
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

    const portfolio = await this.portfoliosService.removePlayer(
      userId,
      season,
      player,
      amount
    )

    // update portfolio associated with selected user and season
    if (!portfolio) {
      throw new InternalServerErrorException('Failed to update portfolio')
    }

    // add new transaction record
    const transaction = await this.transactionModel.create({
      user: Types.ObjectId(userId),
      player: player._id,
      mode: season,
      type: TransactionType.Sell,
      price: player.currentValue,
      amount,
    })

    if (!transaction) {
      throw new InternalServerErrorException('Failed to create transaction')
    }

    return portfolio.populate('players.player')
  }
}
