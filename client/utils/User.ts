export interface DatabaseUser {
  _id: string
  username: string
  email: string
  portfolio: Portfolio
  __v: number
}

export interface Portfolio {
  balance: number
  players: Player[]
}

export interface Player {
  id: string
  purchsedPrice: number
}

export interface User {
  username: string
  email: string
  portfolio: Portfolio
}
