import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { USER_STARTING_BALANCE } from '../../util/constants'

/**
 * Purchsed player schema
 */
@Schema({ _id: false })
export class PurchasedPlayer {
  @Prop({ required: true })
  id: number

  @Prop({ required: true })
  purchasedPrice: number
}
export type PurchasedPlayerDocument = PurchasedPlayer & Document
export const PurchasedPlayerSchema =
  SchemaFactory.createForClass(PurchasedPlayer)

/**
 * User portfolio schema
 */
@Schema({ _id: false })
export class UserPortfolio {
  @Prop({ default: USER_STARTING_BALANCE })
  balance: number

  @Prop({ type: [PurchasedPlayerSchema], default: [] })
  players: PurchasedPlayer[]
}
export type UserPortfolioDocument = UserPortfolio & Document
export const UserPortfolioSchema = SchemaFactory.createForClass(UserPortfolio)
