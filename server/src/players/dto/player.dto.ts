export class PlayerValueDto {
  date: string
  amount: number
}

export class PlayerDto {
  _id: number
  nationality: string[]
  currentValue: number
  dateOfBirth: string
  image: string
  name: string
  position: string
  team: string
  value?: PlayerValueDto[]
}
