import { Type } from 'class-transformer'
import { IsEnum } from 'class-validator'
import { SortOrder } from '@util/constants'

export enum SortBy {
  Name = 'name',
  Value = 'currentValue',
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
