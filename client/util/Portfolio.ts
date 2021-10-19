import { PlayerAsset } from '@util/Player'

export interface Portfolio {
  season: string
  balance: number
  players: PlayerAsset[]
}

export const defaultPortfolio: Portfolio = {
  season: 'standard',
  balance: 0,
  players: [],
}

export interface PortfolioValue {
  date: string
  value: number
}
