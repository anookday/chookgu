import React from 'react'
import styles from '@styles/components/Layout.module.scss'

export interface LayoutProps {
  children?: JSX.Element
}

const Layout = ({ children }: LayoutProps) => {
  return <div className={styles.layout}>{children}</div>
}

export default Layout
