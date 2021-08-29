import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type PlayerValueDocument = PlayerValue & Document

@Schema({ _id: false })
export class PlayerValue {
  @Prop()
  date: Date

  @Prop()
  amount: number
}

export const PlayerValueSchema = SchemaFactory.createForClass(PlayerValue)
