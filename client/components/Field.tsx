import { useState, useEffect, useRef } from 'react'
import Button from '@components/Button'
import styles from '@styles/components/Form.module.scss'

interface FieldProps {
  type: string
  label: string
  value: string
  description: string
  validate: (val: string) => boolean
  onSave: (val: string) => Promise<void>
}

const Field = ({
  type,
  label,
  value,
  description,
  validate,
  onSave,
}: FieldProps) => {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      ref.current?.focus()
    }
  }, [editing])

  const edit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (type === 'password') {
      setText('')
    }
    setEditing(true)
  }

  const cancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setText(value)
    setEditing(false)
  }

  const save = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    await onSave(text)
    setText(value)
    setEditing(false)
  }

  const descStyle = validate(text)
    ? styles.field__description
    : `${styles.field__description} ${styles['field__description--warning']}`

  return (
    <label className={styles.field}>
      <span className={styles.field__title}>{label}</span>
      <div className={styles.form__row}>
        <div className={styles.form__row__content}>
          <input
            ref={ref}
            className={styles.field__input}
            type={type}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            disabled={!editing}
          />
          <p className={descStyle}>{description}</p>
        </div>
      </div>
    </label>
  )
}

export default Field
