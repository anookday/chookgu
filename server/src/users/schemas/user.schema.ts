import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {
  UserPortfolio,
  UserPortfolioSchema,
} from '@users/schemas/userPortfolio.schema'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ unique: true })
  email: string

  @Prop()
  username: string

  @Prop({ type: UserPortfolioSchema, default: () => ({}) })
  portfolio: UserPortfolio

  @Prop({ select: false })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
