import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  GlobalProps,
  GlobalContext,
  getGlobalProps,
} from '@utils/GlobalContext'
import Layout from '@components/Layout'
import Header, { HeaderNavigationProps } from '@components/Header'
import AccountDropdown from '@components/AccountDropdown'

const Tournaments = (props: GlobalProps) => {
  const router = useRouter()

  const headerNav: HeaderNavigationProps[] = [
    { text: 'Dashboard', link: '/' },
    { text: 'Trade', link: '/trade' },
    { text: 'Tournaments', link: '/tournaments', selected: true },
    { text: 'Prizes', link: '/prizes' },
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
            <div>Tournaments</div>
          </Layout>
        </GlobalContext.Provider>
      </main>

      <footer></footer>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Tournaments
