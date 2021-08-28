import React from 'react'
import styles from '@styles/components/Button.module.scss'

export enum ButtonSize {
  Default = 0,
  Small = 1,
}

export enum ButtonColor {
  Default = 2,
  Light = 3,
  Dark = 4,
}

export interface ButtonStyle {
  size: ButtonSize
  color: ButtonColor
}

interface ButtonProps {
  text: string
  style?: ButtonStyle
  href?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ text, style, children, ...actions }, ref) => {
    const styleMap = {
      [ButtonSize.Default]: styles.sizeDefault,
      [ButtonSize.Small]: styles.sizeSmall,
      [ButtonColor.Default]: styles.colorDefault,
      [ButtonColor.Light]: styles.colorLight,
      [ButtonColor.Dark]: styles.colorDark,
    }

    const size = style?.size || ButtonSize.Default
    const color = style?.color || ButtonColor.Default

    return (
      <button
        ref={ref}
        {...actions}
        className={`${styleMap[size]} ${styleMap[color]}`}
      >
        {text}
      </button>
    )
  }
)

export default Button
