import React from 'react'
import styles from '@styles/components/Button.module.scss'

export enum ButtonSize {
  Default,
  Small,
}

export enum ButtonColor {
  Default,
  Light,
  Dark,
}

interface ButtonProps {
  text: string
  size?: ButtonSize
  color?: ButtonColor
  href?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ text, size, color, children, ...actions }, ref) => {
    let sizeStyle, colorStyle
    switch (size) {
      case ButtonSize.Small:
        sizeStyle = styles.sizeSmall
        break
      default:
        sizeStyle = styles.sizeDefault
    }

    switch (color) {
      case ButtonColor.Light:
        colorStyle = styles.colorLight
        break
      case ButtonColor.Dark:
        colorStyle = styles.colorDark
        break
      default:
        colorStyle = styles.colorDefault
    }

    return (
      <button ref={ref} {...actions} className={`${sizeStyle} ${colorStyle}`}>
        {text}
      </button>
    )
  }
)

export default Button
