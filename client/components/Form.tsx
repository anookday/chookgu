import Button from './Button'
import styles from '../styles/components/Form.module.scss'

export interface FormProps {
  username?: string
  setUsername?: React.Dispatch<React.SetStateAction<string>>
  password?: string
  setPassword?: React.Dispatch<React.SetStateAction<string>>
  onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Form = (props: FormProps) => {
  const { username, setUsername, password, setPassword, onSubmit } = props

  const renderUsernameField = (): JSX.Element | null => {
    return username === undefined || setUsername === undefined ? null : (
      <label className={styles.form__label}>
        Email
        <input
          className={styles.form__input}
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.currentTarget.value)
          }}
        />
      </label>
    )
  }

  const renderPasswordField = (): JSX.Element | null => {
    return password === undefined || setPassword === undefined ? null : (
      <label className={styles.form__label}>
        Password
        <input
          className={styles.form__input}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value)
          }}
        />
      </label>
    )
  }

  return (
    <form className={styles.form}>
      {renderUsernameField()}
      {renderPasswordField()}
      <Button text="Login" onClick={onSubmit} />
    </form>
  )
}

export default Form
