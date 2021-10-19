import { parseISO, differenceInYears } from 'date-fns'

export interface PlayerValue {
  date: string
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
  currentValue: number
  value: PlayerValue[]
  margin?: number
  marginRatio?: number
}

export interface PlayerAsset {
  player: Player
  amount: number
  averageValue: number
}

export function isPlayerAsset(object: any): object is PlayerAsset {
  return 'player' in object && 'amount' in object && 'averageValue' in object
}

export function getPlayerAge(dateOfBirth: string): number {
  return differenceInYears(new Date(), parseISO(dateOfBirth))
}
