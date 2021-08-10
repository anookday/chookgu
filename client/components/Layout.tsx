import React from 'react'
import styles from '../styles/components/Layout.module.scss'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return <div className={styles.layout}>{children}</div>
}

export default Layout
