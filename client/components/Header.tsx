import Link from 'next/link'
import Icon from '@public/player.svg'
import styles from '@styles/components/Header.module.scss'

export interface HeaderNavigationProps {
  text: string
  selected?: true
  link?: string
}

export interface HeaderProps {
  navigation: HeaderNavigationProps[]
  children?: JSX.Element
  className?: string
}

const Header = ({ navigation, children, className }: HeaderProps) => {
  const renderNavigationItems = () => {
    return navigation.map((item, index) => (
      <Link key={index} href={item.link || '#'}>
        <a
          className={`${styles.header__link} ${
            item.selected ? styles.header__link__active : ''
          }`}
        >
          {item.text}
        </a>
      </Link>
    ))
  }

  return (
    <header className={`${styles.header}${className ? ` ${className}` : ''}`}>
      <div className={styles.header__left}>
        <Link href="/#" passHref>
          <Icon className={styles.header__logo} />
        </Link>
      </div>
      <nav className={styles.header__middle}>{renderNavigationItems()}</nav>
      <div className={styles.header__right}>{children}</div>
    </header>
  )
}

export default Header
