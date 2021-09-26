import { Type } from 'class-transformer'
import { IsInt } from 'class-validator'

export class TransactionDto {
  season: string

  @Type(() => Number)
  playerId: number

  @Type(() => Number)
  @IsInt()
  amount: number
}
