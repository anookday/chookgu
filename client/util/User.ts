export type UserAuth = 'user' | 'admin'

export interface User {
  username: string
  email: string
  verified: boolean
  auth: UserAuth
}

export const defaultUser: User = {
  username: '',
  email: '',
  verified: false,
  auth: 'user',
}
