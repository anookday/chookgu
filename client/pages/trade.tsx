import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  GlobalProps,
  GlobalContext,
  getInitialGlobalProps,
} from '../utils/GlobalContext'
import Layout from '../components/Layout'
import Header, { HeaderNavigationProps } from '../components/Header'
import AccountDropdown from '../components/AccountDropdown'

const Trade: NextPage<GlobalProps> = (props) => {
  const router = useRouter()

  const headerNav: HeaderNavigationProps[] = [
    { text: 'Dashboard', link: '/' },
    { text: 'Trade', link: '/trade', selected: true },
    { text: 'Tournaments' },
    { text: 'Prizes' },
  ]

  if (!props.loggedIn) {
    router.push('/')
  }

  return (
    <div>
      <Head>
        <title>Chookgu Trade</title>
        <meta name="description" content="Trade players" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <GlobalContext.Provider value={props}>
          <Header navigation={headerNav}>
            <AccountDropdown />
          </Header>

          <Layout>
            <div>Trade content</div>
          </Layout>
        </GlobalContext.Provider>
      </main>

      <footer></footer>
    </div>
  )
}

Trade.getInitialProps = getInitialGlobalProps

export default Trade
