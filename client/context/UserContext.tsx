import { GetServerSideProps } from 'next'
import { createContext, useContext, useState, ReactNode } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { User, DatabaseUser } from '@utils/User'
import api from '@utils/api'

export interface UserProps {
  loggedIn: boolean
  user: User
}

const defaultUser: User = {
  username: '',
  email: '',
  portfolio: {
    balance: 0,
    players: [],
  },
}

export const UserContext = createContext({
  user: defaultUser,
  setUser: (state: User) => {},
})

export const useUser = () => useContext(UserContext)

interface ProviderProps {
  value: User
  children: ReactNode
}

export const UserContextProvider = ({ value, children }: ProviderProps) => {
  const [user, setUser] = useState<User>(value)

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    </>
  )
}

export const getUserProps: GetServerSideProps<
  UserProps,
  ParsedUrlQuery
> = async ({ req }) => {
  let props: UserProps = {
    loggedIn: false,
    user: defaultUser,
  }

  try {
    const profile = await api.get<DatabaseUser>('auth/profile', {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    const { _id, __v, ...user } = profile.data
    props.user = user
    props.loggedIn = true
  } catch (e) {
    // no user session found
  }

  return { props }
}
