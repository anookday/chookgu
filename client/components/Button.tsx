import React from 'react'
import styles from '@styles/components/Button.module.scss'

type ButtonSize = 'default' | 'small'

type ButtonColor = 'default' | 'light' | 'dark' | 'warning'

interface ButtonProps {
  text: string
  size?: ButtonSize
  color?: ButtonColor
  disabled?: boolean
  href?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ text, size, color, children, ...actions }, ref) => {
    let style = styles.button
    switch (size) {
      case 'small':
        style += ' ' + styles['button--small']
        break
      default:
    }

    switch (color) {
      case 'light':
        style += ' ' + styles['button--light']
        break
      case 'dark':
        style += ' ' + styles['button--dark']
        break
      case 'warning':
        style += ' ' + styles['button--warning']
        break
      default:
    }

    return (
      <button ref={ref} {...actions} className={style}>
        {text}
      </button>
    )
  }
)

export default Button
