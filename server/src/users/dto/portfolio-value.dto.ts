class TotalValue {
  date: Date
  value: number
}

export class PortfolioValueDto {
  user: string
  mode: string
  values: TotalValue[]

  constructor(user: string, mode: string) {
    this.user = user
    this.mode = mode
  }
}
