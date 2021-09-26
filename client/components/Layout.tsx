import React from 'react'
import styles from '@styles/components/Layout.module.scss'

export interface LayoutProps {
  children?: JSX.Element | JSX.Element[]
  headless?: true
}

const Layout = ({ children, headless }: LayoutProps) => {
  const style = headless
    ? `${styles.layout} ${styles['layout--headless']}`
    : styles.layout
  return <div className={style}>{children}</div>
}

export default Layout
