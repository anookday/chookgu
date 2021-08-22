import { parseISO, differenceInYears } from 'date-fns'

export interface PlayerValue {
  date: Date
  amount: number
  currency: string
}

export interface Player {
  _id: number
  name: string
  nationality: string[]
  position: string
  team: string
  image: string
  dateOfBirth: string
  value: PlayerValue[]
}

export function getPlayerAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth))
}

export function getPlayerCurrentValue(values: PlayerValue[]): string {
  const currentPlayerValue = values[values.length - 1]

  if (!currentPlayerValue) return ''

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
  }).format(currentPlayerValue.amount)
}
