import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { PlayerValueSchema, PlayerValue } from './playerValue.schema'

export type PlayerDocument = Player & Document

@Schema()
export class Player {
  @Prop({ required: true, unique: true })
  _id: number

  @Prop({ text: true })
  name: string

  @Prop({ index: true })
  position: string

  @Prop({ type: [String], index: true })
  nationality: string[]

  @Prop({ index: true })
  dateOfBirth: Date

  @Prop({ index: true })
  team: string

  @Prop()
  image: string

  @Prop({ type: [PlayerValueSchema], default: [] })
  value: PlayerValue[]
}

export const PlayerSchema = SchemaFactory.createForClass(Player)
