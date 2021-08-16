import React from 'react'
import styles from '../styles/components/Button.module.scss'

type ButtonProps = {
  text: string
  href?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    let { text, children, ...actions } = props
    return (
      <button ref={ref} {...actions} className={styles.button}>
        {text}
      </button>
    )
  }
)

export default Button
