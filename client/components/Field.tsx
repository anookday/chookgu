import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react'
import styles from '@styles/components/Form.module.scss'
import VisibilityOn from '@public/visibility.svg'
import VisibilityOff from '@public/visibility_off.svg'

interface FieldProps {
  type: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  label?: string
  description?: string
  focused?: true
  validate?: (val: string) => boolean
}

/**
 * Generic input field component.
 */
const Field = ({
  type,
  value,
  setValue,
  label,
  description,
  focused,
  validate,
}: FieldProps) => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  /**
   * If focus is enabled, make browser focus this field's input element once
   * component is created.
   */
  useEffect(() => {
    if (focused) {
      ref.current?.focus()
      ref.current?.select()
    }
  }, [focused])

  /**
   * Returns the input type. Used mainly to toggle password visibility.
   */
  const getType = () => {
    if (type !== 'password') {
      return type
    }

    return visible ? 'text' : 'password'
  }

  /**
   * Returns field description's class name to change styling based on
   * input validation.
   */
  const getDescriptionStyle = () => {
    let style = styles.field__description

    if (validate && !validate(value)) {
      style += ' ' + styles['field__description--warning']
    }

    return style
  }

  /**
   * Returns the visibility toggle component. Rendered only if the field
   * is of type "password".
   */
  const renderVisibilityToggle = () => {
    if (type === 'password') {
      return visible ? (
        <VisibilityOn
          className={styles.field__icon}
          onClick={() => setVisible(false)}
        />
      ) : (
        <VisibilityOff
          className={styles.field__icon}
          onClick={() => setVisible(true)}
        />
      )
    }

    return null
  }

  return (
    <label className={styles.field}>
      <span className={styles.field__title}>{label}</span>
      <input
        ref={ref}
        className={styles.field__input}
        type={getType()}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <p className={getDescriptionStyle()}>{description}</p>
      {renderVisibilityToggle()}
    </label>
  )
}

export default Field
