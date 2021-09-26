import { PlayerAsset } from '@utils/Player'

export interface UserPortfolio {
  mode: string
  balance: number
  players?: PlayerAsset[]
}

export interface User {
  username: string
  email: string
  portfolio: UserPortfolio[]
  verified: boolean
}
