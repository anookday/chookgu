import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react'
import { User, defaultUser } from '@util/User'

type ContextParams = [User, Dispatch<SetStateAction<User>>]

export const UserContext = createContext<ContextParams>([
  defaultUser,
  (value: SetStateAction<User>) => {},
])

export const useUser = () => useContext(UserContext)

interface ProviderProps {
  value: User
  children: ReactNode
}

export const UserContextProvider = ({ value, children }: ProviderProps) => {
  const state = useState<User>(value)

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>
}
