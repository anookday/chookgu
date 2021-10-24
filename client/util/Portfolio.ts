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
