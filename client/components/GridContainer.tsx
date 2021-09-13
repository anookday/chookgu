import React from 'react'
import styles from '@styles/components/GridContainer.module.scss'

export interface GridContainerProps {
  children?: JSX.Element | JSX.Element[]
  className?: string
}

/**
 * Grid container component. 2x2 by default.
 */
const GridContainer = ({ children, className }: GridContainerProps) => {
  const style = className
    ? `${styles.container} ${className}`
    : styles.container

  return <div className={style}>{children}</div>
}

export default GridContainer
