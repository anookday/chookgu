import Link from 'next/link'
import Icon from '../public/player.svg'
import Button from './Button'
import styles from '../styles/components/Header.module.scss'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <Icon className={styles.header__logo} />
      </div>
      <div className={styles.header__middle}>
        <a className={styles.header__link}>Features</a>
        <a className={styles.header__link}>Leagues</a>
        <a className={styles.header__link}>Prizes</a>
        <a className={styles.header__link}>Contact</a>
      </div>
      <div className={styles.header__right}>
        <Link href="/login">
          <a className={styles.header__link}>Sign in</a>
        </Link>
        <Link href="/register" passHref>
          <Button text="Get started" />
        </Link>
      </div>
    </header>
  )
}

export default Header
