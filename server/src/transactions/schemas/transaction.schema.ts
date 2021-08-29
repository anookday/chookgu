import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'

export enum TransactionType {
  Buy = 'buy',
  Sell = 'sell',
}

export type TransactionDocument = Transaction & Document

@Schema()
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: 1 })
  user: Types.ObjectId

  @Prop({ type: Number, ref: 'Player' })
  player: number

  @Prop({ type: String, enum: TransactionType })
  type: string

  @Prop()
  amount: number

  @Prop({ type: Date, default: Date.now })
  date: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)
