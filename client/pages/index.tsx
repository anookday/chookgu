import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import {
  GlobalProps,
  GlobalContext,
  getInitialGlobalProps,
} from '../utils/GlobalContext'
import Header from '../components/Header'
import Button from '../components/Button'
import AccountDropdown from '../components/AccountDropdown'
import Dashboard from '../components/Dashboard'
import Landing from '../components/Landing'
import headerStyles from '../styles/components/Header.module.scss'

const Home: NextPage<GlobalProps> = (props) => {
  const renderMain = () => {
    // if user is logged in return dashboard
    if (props.loggedIn) {
      return (
        <GlobalContext.Provider value={props}>
          <Header
            navigation={[
              { text: 'Dashboard', link: '/', selected: true },
              { text: 'Trade', link: '/trade' },
              { text: 'Tournaments' },
              { text: 'Prizes' },
            ]}
          >
            <AccountDropdown />
          </Header>
          <Dashboard />
        </GlobalContext.Provider>
      )
    }
    // if user is not logged in return landing page
    return (
      <>
        <Header
          navigation={[
            { text: 'Overview', link: '#overview' },
            { text: 'Tournaments', link: '#tournaments' },
            { text: 'Prizes', link: '#prizes' },
            { text: 'Contact', link: '#contact' },
          ]}
        >
          <Link href="/account/login">
            <a className={headerStyles.header_link}>Sign in</a>
          </Link>
          <Link href="/account/register" passHref>
            <Button text="Get started" />
          </Link>
        </Header>
        <Landing />
      </>
    )
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

Home.getInitialProps = getInitialGlobalProps

export default Home
