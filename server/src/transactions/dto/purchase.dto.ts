import { Type } from 'class-transformer'

export class PurchaseDto {
  @Type(() => Number)
  playerId: number
}
