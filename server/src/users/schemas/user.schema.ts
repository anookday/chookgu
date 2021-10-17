import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'

export type UserAuth = 'admin' | 'user'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: Types.ObjectId

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  username: string

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
