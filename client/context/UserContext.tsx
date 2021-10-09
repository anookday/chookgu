import { GetServerSideProps } from 'next'
import { createContext, useContext, useState, ReactNode } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { User } from '@util/User'
import api from '@util/api'

export interface UserProps {
  loggedIn: boolean
  user: User
}

const defaultUser: User = {
  username: '',
  email: '',
  verified: false,
  portfolio: [],
  auth: 'user',
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
    const profile = await api.get<User>('auth/profile', {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    props.user = profile.data
    props.loggedIn = true
  } catch (e) {
    // no user session found
  }

  return { props }
}
