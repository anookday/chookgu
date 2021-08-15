export interface DatabaseUser {
  _id: number
  username: string
  email: string
  balance: number
  __v: number
}

export interface User {
  username: string
  email: string
  balance: number
}
