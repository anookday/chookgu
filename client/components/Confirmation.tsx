import { useState } from 'react'
import Button from '@components/Button'
import Layout from '@components/Layout'
import { useUser } from '@context/UserContext'
import EmailIcon from '@public/email.svg'
import styles from '@styles/components/SingleWidget.module.scss'
import api from '@util/api'

const Confirmation = () => {
  const { user } = useUser()
  const [message, setMessage] = useState('Resend Confirmation')

  const resendConfirmation = async () => {
    try {
      setMessage('Sending...')
      await api.post('/auth/send-confirmation')
      setMessage('Email sent!')
    } catch (error) {
      console.error(error)
      setMessage('Failed to send Email.')
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={`${styles.widget} ${styles['widget--centered']}`}>
          <EmailIcon className={styles.widget__icon} />
          <div className={styles.widget__text}>
            We have sent an account confirmation email to{' '}
            <span>{user.email}</span>. Click the link in the email to activate
            your account.
          </div>
          <div className={styles.widget__footer}>
            <Button text={message} onClick={() => resendConfirmation()} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Confirmation
