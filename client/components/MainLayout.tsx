import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header, { HeaderNavigationProps } from '@components/Header'
import Button from '@components/Button'
import UserMenu from '@components/UserMenu'
import Landing from '@components/Landing'
import { UserProps, UserContextProvider } from '@context/UserContext'
import styles from '@styles/components/MainLayout.module.scss'

interface MainLayoutProps extends UserProps {
  selected: number
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
  }, [])

  // if user is logged in return props children
  if (props.loggedIn) {
    const navigation: HeaderNavigationProps[] = [
      { text: 'Home', link: '/' },
      { text: 'Portfolio', link: '/portfolio' },
      { text: 'Trade', link: '/trade' },
      { text: 'Tournaments', link: '/tournaments' },
      { text: 'Prizes', link: '/prizes' },
    ]

    navigation[props.selected].selected = true

    return (
      <UserContextProvider value={props.user}>
        <Header navigation={navigation}>
          <UserMenu />
        </Header>
        <main>{props.children}</main>
      </UserContextProvider>
    )
  }
  // if user is not logged in return landing page
  return (
    <>
      <Header
        className={`${styles.landingHeader}\
          ${isPageTop ? '' : ` ${styles['landingHeader--scrolledDown']}`}`}
        navigation={[
          { text: 'Overview', link: '#overview' },
          { text: 'Tournaments', link: '#tournaments' },
          { text: 'Prizes', link: '#prizes' },
          { text: 'Contact', link: '#contact' },
        ]}
      >
        <>
          <Link href="/account/login">
            <a className={styles.link}>Sign in</a>
          </Link>
          <Link href="/account/register" passHref>
            <Button text="Get started" />
          </Link>
        </>
      </Header>
      <main>
        <Landing />
      </main>
    </>
  )
}

export default MainLayout
