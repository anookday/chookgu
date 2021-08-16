import React, { useState, useEffect, useRef } from 'react'
import Button from './Button'
import VisibilityOnIcon from '../public/visibility.svg'
import VisiblityOffIcon from '../public/visibility_off.svg'
import styles from '../styles/components/Form.module.scss'

export interface FormProps {
  email?: string
  setEmail?: React.Dispatch<React.SetStateAction<string>>
  username?: string
  setUsername?: React.Dispatch<React.SetStateAction<string>>
  password?: string
  setPassword?: React.Dispatch<React.SetStateAction<string>>
  submitText: string
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Form = ({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  submitText,
  onSubmit,
}: FormProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // componentDidMount
  useEffect(() => {
    if (formRef.current) {
      const firstLabel = formRef.current.firstElementChild
      const firstField = firstLabel?.childNodes.item(1)
      if (firstField && firstField instanceof HTMLInputElement) {
        firstField.focus()
      }
    }
  }, [])

  /**
   * Returns an email field component.
   */
  const renderEmailField = (): JSX.Element | null => {
    return email === undefined || setEmail === undefined ? null : (
      <label className={styles.form_field}>
        <span className={styles.form_field__title}>Email</span>
        <input
          className={styles.form_field__input}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value)
          }}
        />
        <p className={styles.form_field__description}>
          Must be a valid, unique email
        </p>
      </label>
    )
  }

  /**
   * Returns a username field component.
   */
  const renderUsernameField = (): JSX.Element | null => {
    return username === undefined || setUsername === undefined ? null : (
      <label className={styles.form_field}>
        <span className={styles.form_field__title}>Display name</span>
        <input
          className={styles.form_field__input}
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value)
          }}
        />
        <p className={styles.form_field__description}>
          Must be between 1 and 30 characters
        </p>
      </label>
    )
  }

  /**
   * Returns a password field component.
   */
  const renderPasswordField = (): JSX.Element | null => {
    const visibilityIcon = isPasswordVisible ? (
      <VisibilityOnIcon
        className={styles.form_field__icon}
        onClick={() => {
          setIsPasswordVisible(false)
        }}
      />
    ) : (
      <VisiblityOffIcon
        className={styles.form_field__icon}
        onClick={() => {
          setIsPasswordVisible(true)
        }}
      />
    )

    return password === undefined || setPassword === undefined ? null : (
      <label className={styles.form_field}>
        <span className={styles.form_field__title}>Password</span>
        <input
          className={styles.form_field__input}
          type={isPasswordVisible ? 'text' : 'password'}
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value)
          }}
        />
        <p className={styles.form_field__description}>
          Must be at least 10 characters long
        </p>
        {visibilityIcon}
      </label>
    )
  }

  // render form
  return (
    <form className={styles.form} ref={formRef}>
      {renderEmailField()}
      {renderUsernameField()}
      {renderPasswordField()}
      <Button text={submitText} onClick={onSubmit} />
    </form>
  )
}

export default Form
