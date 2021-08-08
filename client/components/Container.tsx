import React from 'react'
import styles from '../styles/components/Container.module.scss'

type ContainerProps = {
  children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return <div className={styles.container}>{children}</div>
}

export default Container
