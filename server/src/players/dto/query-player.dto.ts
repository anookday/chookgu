import { Type } from 'class-transformer'
import { IsEnum } from 'class-validator'

export enum SortBy {
  Name = 'name',
  Value = 'currentValue',
}

export enum SortOrder {
  Asc = 1,
  Desc = -1,
}

export class QueryPlayerDto {
  @Type(() => Number)
  index: number

  @IsEnum(SortBy)
  sortBy: SortBy

  @Type(() => Number)
  @IsEnum(SortOrder)
  sortOrder: SortOrder

  search: string
}
