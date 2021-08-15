import { NextPage } from 'next'
import Head from 'next/head'
import { GlobalProps, GlobalContext } from '../utils/GlobalContext'
import App from '../components/App'
import Landing from '../components/Landing'
import { DatabaseUser } from '../utils/User'
import api from '../utils/api'

const Home: NextPage<GlobalProps> = (props) => {
  const renderMain = () => {
    if (props.loggedIn) {
      return (
        <GlobalContext.Provider value={props}>
          <App />
        </GlobalContext.Provider>
      )
    }
    return <Landing />
  }

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Chookgu description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{renderMain()}</main>

      <footer></footer>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
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

export default Home
