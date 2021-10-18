import { GetServerSideProps } from 'next'
import { Portfolio, defaultPortfolio } from '@util/Portfolio'
import { User, defaultUser } from '@util/User'
import api from '@util/api'

export interface GlobalProps {
  loggedIn: boolean
  user: User
  portfolio: Portfolio
}

export const getGlobalProps: GetServerSideProps<GlobalProps> = async ({
  req,
}) => {
  let props: GlobalProps = {
    loggedIn: false,
    user: defaultUser,
    portfolio: defaultPortfolio,
  }

  try {
    const userRes = await api.get<User>('user', {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    props.user = userRes.data
    props.loggedIn = true

    const portfolioRes = await api.get<Portfolio>('portfolio?season=standard', {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    props.portfolio = portfolioRes.data
  } catch (err) {
    if (err.response && err.response.data) {
      console.error(err.response.data)
    }
  }

  return { props }
}
