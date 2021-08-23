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
          className={`${styles.header_link} ${
            item.selected ? styles.header_link__active : ''
          }`}
        >
          {item.text}
        </a>
      </Link>
    ))
  }

  return (
    <header className={`${styles.header}${className ? ` ${className}` : ''}`}>
      <div className={styles.header_left}>
        <Icon className={styles.header_logo} />
      </div>
      <div className={styles.header_middle}>{renderNavigationItems()}</div>
      <div className={styles.header_right}>{children}</div>
    </header>
  )
}

export default Header
