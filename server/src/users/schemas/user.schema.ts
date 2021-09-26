import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import {
  UserPortfolio,
  UserPortfolioSchema,
} from '@users/schemas/userPortfolio.schema'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true })
  email: string

  @Prop()
  username: string

  @Prop({ type: [UserPortfolioSchema], default: [{ mode: 'standard' }] })
  portfolio: UserPortfolio[]

  @Prop({ select: false })
  password: string

  @Prop({ type: Boolean, default: false })
  verified: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)

export function isUserDocument(
  obj: Types.ObjectId | UserDocument
): obj is UserDocument {
  return !(obj instanceof Types.ObjectId)
}
