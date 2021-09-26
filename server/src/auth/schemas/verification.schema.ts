import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, Schema as MongooseSchema } from 'mongoose'
import { UserDocument } from '@users/schemas/user.schema'
import { VERIFICATION_MAX_AGE } from '@util/constants'

export type VerificationDocument = Verification & Document

@Schema()
export class Verification {
  @Prop({ type: String, required: true })
  _id: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | UserDocument

  @Prop({ type: Date, default: Date.now, expires: VERIFICATION_MAX_AGE })
  expires: Date
}

export const VerificationSchema = SchemaFactory.createForClass(Verification)
