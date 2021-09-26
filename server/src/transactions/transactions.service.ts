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
import { isPlayerDocument } from '@players/schemas/player.schema'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
    private playersService: PlayersService
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

    if (!user || !player) {
      throw new BadRequestException('Invalid id')
    }

    if (amount < 1) {
      throw new BadRequestException('Invalid amount')
    }

    let portfolio = user.portfolio.find(({ mode }) => mode === season)

    if (!portfolio) {
      throw new BadRequestException('Invalid season')
    }

    const totalPrice = player.currentValue * amount

    if (totalPrice > portfolio.balance) {
      throw new BadRequestException('Insufficient funds')
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
      throw new InternalServerErrorException('Transaction failed')
    }

    // update user portfolio
    portfolio.balance -= totalPrice

    const playerIndex = portfolio.players.findIndex(
      (p) => !isPlayerDocument(p.player) && p.player == playerId
    )

    if (playerIndex > -1) {
      let p = portfolio.players[playerIndex]
      // calculate new average value
      p.averageValue =
        (p.averageValue * p.amount + totalPrice) / (p.amount + amount)
      p.amount += amount
    } else {
      portfolio.players.push({
        player: playerId,
        amount,
        averageValue: player.currentValue,
      })
    }

    return await user.save()
  }

  async sellPlayer(
    season: string,
    userId: string,
    playerId: number,
    amount: number
  ) {
    let user = await this.usersService.findById(userId)
    const player = await this.playersService.findById(playerId)

    if (!user || !player) {
      throw new BadRequestException('Invalid id')
    }

    let portfolio = user.portfolio.find(({ mode }) => mode === season)

    if (!portfolio) {
      throw new BadRequestException('Invalid season')
    }

    const playerIndex = portfolio.players.findIndex(
      (p) => !isPlayerDocument(p.player) && p.player == playerId
    )

    if (playerIndex === -1) {
      throw new BadRequestException('User does not own this player')
    }

    const newAmount = portfolio.players[playerIndex].amount - amount

    if (amount < 1 || newAmount < 0) {
      throw new BadRequestException('Invalid amount')
    }

    const transaction = await this.transactionModel.create({
      user: Types.ObjectId(userId),
      player: player._id,
      mode: season,
      type: TransactionType.Sell,
      price: player.currentValue,
      amount,
    })

    if (!transaction) {
      throw new InternalServerErrorException('Transaction failed')
    }

    portfolio.balance += player.currentValue * amount

    if (newAmount === 0) {
      portfolio.players.splice(playerIndex, 1)
    } else {
      portfolio.players[playerIndex].amount = newAmount
    }

    return await user.save()
  }
}
