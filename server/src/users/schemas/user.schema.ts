import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import {
  UserPortfolio,
  UserPortfolioSchema,
} from '@users/schemas/userPortfolio.schema'

export type UserAuth = 'admin' | 'user'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  username: string

  @Prop({ type: [UserPortfolioSchema], default: [{ mode: 'standard' }] })
  portfolio: UserPortfolio[]

  @Prop({ select: false, required: true })
  password: string

  @Prop({ type: Boolean, default: false })
  verified: boolean

  @Prop({ type: String, default: 'user' })
  auth: UserAuth

  @Prop({ type: Date, select: false, default: Date.now })
  created: Date

  @Prop({ type: Date, select: false, default: Date.now })
  modified: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

export function isUserDocument(
  obj: Types.ObjectId | UserDocument
): obj is UserDocument {
  return !(obj instanceof Types.ObjectId)
}
