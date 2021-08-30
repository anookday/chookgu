import { Model, Types } from 'mongoose'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
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

  async buyPlayer(userId: string, playerId: number, amount: number) {
    let user = await this.usersService.findById(userId)
    const player = await this.playersService.findById(playerId)

    if (!user || !player) {
      throw new NotFoundException('Resource not found')
    }

    if (amount < 1) {
      throw new BadRequestException('Invalid amount')
    }

    const totalPrice = player.currentValue * amount

    if (totalPrice > user.portfolio.balance) {
      throw new BadRequestException('Insufficient funds')
    }

    // add new transaction record
    const transaction = await this.transactionModel.create({
      user: Types.ObjectId(userId),
      player: playerId,
      type: TransactionType.Buy,
      price: player.currentValue,
      amount,
    })

    if (!transaction) {
      throw new InternalServerErrorException('Transaction failed')
    }

    // update user portfolio
    user.portfolio.balance -= totalPrice

    const playerIndex = user.portfolio.players.findIndex(
      (p) => !isPlayerDocument(p.player) && p.player == playerId
    )

    if (playerIndex > -1) {
      let p = user.portfolio.players[playerIndex]
      // calculate new average value
      p.averageValue =
        (p.averageValue * p.amount + totalPrice) / (p.amount + amount)
      p.amount += amount
    } else {
      user.portfolio.players.push({
        player: playerId,
        amount,
        averageValue: player.currentValue,
      })
    }

    return await user.save()
  }

  async sellPlayer(userId: string, playerId: number, amount: number) {
    let user = await this.usersService.findById(userId)
    const player = await this.playersService.findById(playerId)

    if (!user || !player) {
      throw new NotFoundException('Resource not found')
    }

    const playerIndex = user.portfolio.players.findIndex(
      (p) => !isPlayerDocument(p.player) && p.player == playerId
    )

    if (playerIndex === -1) {
      throw new BadRequestException('User does not own this player')
    }

    const newAmount = user.portfolio.players[playerIndex].amount - amount

    if (amount < 1 || newAmount < 0) {
      throw new BadRequestException('Invalid amount')
    }

    const transaction = await this.transactionModel.create({
      user: Types.ObjectId(userId),
      player: player._id,
      type: TransactionType.Sell,
      price: player.currentValue,
      amount,
    })

    if (!transaction) {
      throw new InternalServerErrorException('Transaction failed')
    }

    user.portfolio.balance += player.currentValue * amount

    if (newAmount === 0) {
      user.portfolio.players.splice(playerIndex, 1)
    } else {
      user.portfolio.players[playerIndex].amount = newAmount
    }

    return await user.save()
  }
}
