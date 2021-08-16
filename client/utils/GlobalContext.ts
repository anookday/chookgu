import { NextPageContext } from 'next'
import { createContext, useContext } from 'react'
import { User, DatabaseUser } from './User'
import api from './api'

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

export const getInitialGlobalProps = async (context: NextPageContext) => {
  const { req } = context
  let props: GlobalProps = {
    loggedIn: false,
    user: {
      email: '',
      username: '',
      balance: 0,
    },
  }
  try {
    const profile = await api.get<DatabaseUser>('auth/profile', {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    const { _id, __v, ...user } = profile.data
    props.user = user
    props.loggedIn = true
  } catch (e) {
    console.log('no user session found')
  }
  return props
}
