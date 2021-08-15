import Link from 'next/link'
import Icon from '../public/player.svg'
import Button from './Button'
import styles from '../styles/components/Header.module.scss'

const LandingHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header_left}>
        <Icon className={styles.header_logo} />
      </div>
      <div className={styles.header_middle}>
        <a className={styles.header_link}>Features</a>
        <a className={styles.header_link}>Leagues</a>
        <a className={styles.header_link}>Prizes</a>
        <a className={styles.header_link}>Contact</a>
      </div>
      <div className={styles.header_right}>
        <Link href="/account/login">
          <a className={styles.header_link}>Sign in</a>
        </Link>
        <Link href="/account/register" passHref>
          <Button text="Get started" />
        </Link>
      </div>
    </header>
  )
}

export default LandingHeader
