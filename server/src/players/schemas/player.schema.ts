import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  PlayerValueSchema,
  PlayerValue,
} from '@players/schemas/playerValue.schema'

export type PlayerDocument = Player & Document

@Schema()
export class Player {
  @Prop({ required: true })
  _id: number

  @Prop()
  name: string

  @Prop()
  position: string

  @Prop()
  nationality: string[]

  @Prop()
  dateOfBirth: Date

  @Prop()
  team: string

  @Prop()
  image: string

  @Prop()
  currentValue: number

  @Prop({ type: [PlayerValueSchema], default: [] })
  value: PlayerValue[]
}

export const PlayerSchema = SchemaFactory.createForClass(Player)

PlayerSchema.index(
  { name: 'text', team: 'text', position: 'text', currentValue: 1 },
  { name: 'search' }
)
