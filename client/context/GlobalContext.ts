import { GetServerSideProps } from 'next'
import axios from 'axios'
import { Portfolio, defaultPortfolio } from '@util/Portfolio'
import { User, defaultUser } from '@util/User'

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
    const userRes = await axios.get<User>(`${process.env.API_URL}/api/user`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    props.user = userRes.data
    props.loggedIn = true

    const portfolioRes = await axios.get<Portfolio>(
      `${process.env.API_URL}/api/portfolio?season=standard`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    )
    props.portfolio = portfolioRes.data
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data)
    }
  }

  return { props }
}
