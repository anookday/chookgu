import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { PlayerDocument } from '@players/schemas/player.schema'
import { UserDocument } from '@users/schemas/user.schema'

/**
 * Player asset schema
 */
@Schema({ _id: false })
export class PlayerAsset {
  @Prop({ type: Number, required: true, ref: 'Player' })
  player: number | PlayerDocument

  @Prop({ required: true })
  amount: number

  @Prop({ required: true })
  averageValue: number
}

export type PlayerAssetDocument = PlayerAsset & Document
export const PlayerAssetSchema = SchemaFactory.createForClass(PlayerAsset)

/**
 * Portfolio schema
 */
@Schema()
export class Portfolio {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | UserDocument

  @Prop({ type: String, required: true })
  season: string

  @Prop({ type: Number, default: 0 })
  balance: number

  @Prop({ type: [PlayerAssetSchema], default: [] })
  players: PlayerAsset[]
}

export type PortfolioDocument = Portfolio & Document
export const PortfolioSchema = SchemaFactory.createForClass(Portfolio)

/**
 * index to ensure uniqueness on user-mode pairs
 */
PortfolioSchema.index(
  {
    user: 1,
    season: 1,
  },
  { unique: true }
)
