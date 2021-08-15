import Icon from '../public/player.svg'
import AccountDropdown from './AccountDropdown'
import styles from '../styles/components/Header.module.scss'

const AppHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header_left}>
        <Icon className={styles.header_logo} />
      </div>
      <div className={styles.header_middle}>
        <a className={`${styles.header_link} ${styles.header_link__active}`}>
          Dashboard
        </a>
        <a className={styles.header_link}>Trade</a>
        <a className={styles.header_link}>Tournaments</a>
        <a className={styles.header_link}>Prizes</a>
      </div>
      <div className={styles.header_right}>
        <AccountDropdown />
      </div>
    </header>
  )
}

export default AppHeader
