import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { UserDocument } from '@users/schemas/user.schema'
import { TOKEN_MAX_AGE } from '@util/constants'

export type TokenDocument = Token & Document

export type TokenType = 'confirm' | 'pw-reset' | 'refresh'

@Schema()
export class Token {
  @Prop({ type: String, required: true })
  _id: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | UserDocument

  @Prop({ type: String, required: true })
  type: TokenType

  @Prop({ type: Date, default: Date.now, expires: TOKEN_MAX_AGE })
  expires: Date
}

export const TokenSchema = SchemaFactory.createForClass(Token)
