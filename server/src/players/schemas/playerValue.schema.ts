import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type PlayerValueDocument = PlayerValue & Document

@Schema()
export class PlayerValue {
  @Prop()
  date: Date

  @Prop()
  amount: number

  @Prop()
  currency: string
}

export const PlayerValueSchema = SchemaFactory.createForClass(PlayerValue)
