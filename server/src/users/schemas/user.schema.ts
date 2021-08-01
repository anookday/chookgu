import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop()
  email: string

  @Prop()
  username: string

  @Prop()
  balance: number

  @Prop({ select: false })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
