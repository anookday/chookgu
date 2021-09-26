import { useState } from 'react'
import Button from '@components/Button'
import Layout from '@components/Layout'
import { useUser } from '@context/UserContext'
import EmailIcon from '@public/email.svg'
import styles from '@styles/components/Confirmation.module.scss'
import api from '@utils/api'

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
        <div className={styles.widget}>
          <EmailIcon className={styles.icon} />
          <div>
            We have sent an account confirmation email to{' '}
            <span className={styles.highlight}>{user.email}</span>. Click the
            link in the email to activate your account.
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
