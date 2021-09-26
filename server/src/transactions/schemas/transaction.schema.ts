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
  player: number | PlayerDocument

  @Prop()
  mode: string

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
TransactionSchema.index({ user: 1, date: -1 })

/**
 * Return true if referenced transaction is a TransactionDocument.
 */
export function isTransactionDocument(
  obj: Types.ObjectId | TransactionDocument
): obj is TransactionDocument {
  return !(obj instanceof Types.ObjectId)
}
