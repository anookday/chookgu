import { Type } from 'class-transformer'

export class QueryPlayerDto {
  @Type(() => Number)
  index: number
  sortBy: string
  @Type(() => Number)
  sortOrder: number
  search: string
}
