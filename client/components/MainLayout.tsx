import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header, { HeaderNavigationProps } from '@components/Header'
import Button from '@components/Button'
import UserMenu from '@components/UserMenu'
import Landing from '@components/Landing'
import Confirmation from '@components/Confirmation'
import { GlobalProps } from '@context/GlobalContext'
import { UserContextProvider } from '@context/UserContext'
import { PortfolioContextProvider } from '@context/PortfolioContext'
import styles from '@styles/components/MainLayout.module.scss'

interface MainLayoutProps extends GlobalProps {
  selected?: string
  children?: JSX.Element
}

const MainLayout = (props: MainLayoutProps) => {
  const [isPageTop, setIsPageTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsPageTop(true)
      } else if (isPageTop) {
        setIsPageTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isPageTop])

  // user is logged in
  if (props.loggedIn) {
    // if user is not verified render email confimration page
    if (!props.user.verified) {
      return (
        <UserContextProvider value={props.user}>
          <PortfolioContextProvider value={props.portfolio}>
            <Header navigation={[]}>
              <UserMenu />
            </Header>
            <main>
              <Confirmation />
            </main>
          </PortfolioContextProvider>
        </UserContextProvider>
      )
    }

    // if user is verified render navigation and content
    const navigation: HeaderNavigationProps[] = [
      { text: 'Home', link: '/' },
      { text: 'Portfolio', link: '/portfolio' },
      { text: 'Trade', link: '/trade' },
      { text: 'Tournaments', link: '/tournaments' },
      { text: 'Prizes', link: '/prizes' },
    ]

    if (props.selected !== undefined) {
      let selectedNav = navigation.find((nav) => nav.text === props.selected)
      if (selectedNav) {
        selectedNav.selected = true
      }
    }

    return (
      <UserContextProvider value={props.user}>
        <PortfolioContextProvider value={props.portfolio}>
          <Header navigation={navigation}>
            <UserMenu />
          </Header>
          <main>{props.children}</main>
        </PortfolioContextProvider>
      </UserContextProvider>
    )
  }

  // if user is not logged in render landing page
  return (
    <>
      <Header
        className={`${styles.header}\
          ${isPageTop ? '' : ` ${styles['header--scrolledDown']}`}`}
        navigation={[
          { text: 'Trade', link: '#trade' },
          { text: 'Compete', link: '#compete' },
          { text: 'Contact', link: '#contact' },
        ]}
      >
        <div className={styles.header__links}>
          <Link href="/account/login" passHref>
            <Button text="Sign In" color="light" />
          </Link>
          <Link href="/account/register" passHref>
            <Button text="Register" />
          </Link>
        </div>
      </Header>
      <main>
        <Landing />
      </main>
    </>
  )
}

export default MainLayout
