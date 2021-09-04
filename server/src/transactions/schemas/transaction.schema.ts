import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { UserDocument } from '@users/schemas/user.schema'
import { PlayerDocument } from '@players/schemas/player.schema'

export enum TransactionType {
  Buy = 'buy',
  Sell = 'sell',
}

export type TransactionDocument = Transaction & Document

@Schema()
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', index: 1 })
  user: Types.ObjectId | UserDocument

  @Prop({ type: Number, ref: 'Player' })
  player: Types.ObjectId | PlayerDocument

  @Prop({ type: String, enum: TransactionType })
  type: string

  @Prop()
  price: number

  @Prop()
  amount: number

  @Prop({ type: Date, default: Date.now })
  date: Date
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)

/**
 * Return true if referenced transaction is a TransactionDocument.
 */
export function isTransactionDocument(
  transaction: Types.ObjectId | TransactionDocument
): transaction is TransactionDocument {
  console.log((transaction as TransactionDocument).schema)
  return (transaction as TransactionDocument).schema !== undefined
}
