import { createContext, useContext } from 'react'
import { User } from './User'

export interface GlobalProps {
  loggedIn: boolean
  user: User
}

export const GlobalContext = createContext<GlobalProps>({
  loggedIn: false,
  user: {
    email: '',
    username: '',
    balance: 0,
  },
})
export const useGlobal = () => useContext(GlobalContext)
