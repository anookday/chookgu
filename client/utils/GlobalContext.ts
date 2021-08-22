import { GetServerSideProps } from 'next'
import { createContext, useContext } from 'react'
import { ParsedUrlQuery } from 'querystring'
import { User, DatabaseUser } from '@utils/User'
import api from '@utils/api'

export interface GlobalProps {
  loggedIn: boolean
  user: User
}

export const GlobalContext = createContext<GlobalProps>({
  loggedIn: false,
  user: {
    email: '',
    username: '',
    portfolio: {
      balance: 0,
      players: [],
    },
  },
})
export const useGlobal = () => useContext(GlobalContext)

export const getGlobalProps: GetServerSideProps<
  GlobalProps,
  ParsedUrlQuery
> = async ({ req }) => {
  let props: GlobalProps = {
    loggedIn: false,
    user: {
      email: '',
      username: '',
      portfolio: {
        balance: 0,
        players: [],
      },
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
    // no user session found
  }

  return { props }
}
