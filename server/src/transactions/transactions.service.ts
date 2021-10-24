import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import {
  Transaction,
  TransactionDocument,
  TransactionType,
} from '@transactions/schemas/transaction.schema'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>
  ) {}

  async get(userId: string, season: string) {
    return await this.transactionModel
      .find({ user: userId, season })
      .sort({ date: 1 })
  }

  async add(
    user: string,
    player: number,
    season: string,
    type: TransactionType,
    amount: number,
    price: number
  ) {
    return await this.transactionModel.create({
      user,
      player,
      season,
      type,
      amount,
      price,
    })
  }

  async remove(_id: string) {
    return await this.transactionModel.deleteOne({ _id })
  }
}
