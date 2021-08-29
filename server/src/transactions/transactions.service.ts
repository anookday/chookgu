import { Model, Types } from 'mongoose'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionDocument,
  TransactionType,
} from '@transactions/schemas/transaction.schema'
import { UsersService } from '@users/users.service'
import { PlayersService } from '@players/players.service'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
    private playersService: PlayersService
  ) {}

  async buyPlayer(userId: string, playerId: number) {
    let user = await this.usersService.findById(userId)
    const player = await this.playersService.findById(playerId)

    if (!user || !player) {
      throw new NotFoundException('Resource not found')
    }

    const newBalance = user.portfolio.balance - player.currentValue
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient funds')
    }

    const result = await this.transactionModel.create({
      user: Types.ObjectId(userId),
      player: playerId,
      type: TransactionType.Buy,
      amount: player.currentValue,
    })

    user.portfolio.balance = newBalance
    user.portfolio.players.push({
      player: playerId,
      purchasedPrice: player.currentValue,
      transaction: result.id,
    })

    return await user.save()
  }
}
