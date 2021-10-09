import { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@components/Layout'
import Button from '@components/Button'
import Field from '@components/Field'
import Key from '@public/key.svg'
import styles from '@styles/components/SingleWidget.module.scss'
import api from '@util/api'

interface PasswordResetProps {
  token: string
}

interface TokenStatus {
  active: boolean
}

enum ResetStatus {
  Ready,
  Processing,
  Success,
  Error,
}

const PasswordReset = ({ token }: PasswordResetProps) => {
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<ResetStatus>(ResetStatus.Ready)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const getMessage = () => {
    switch (status) {
      case ResetStatus.Processing:
        return 'Changing password...'
      case ResetStatus.Success:
        return 'Password changed successfully.'
      case ResetStatus.Error:
        return (
          errorMessage ||
          'An unknown error has occurred. Please try again later.'
        )
      default:
        return ''
    }
  }

  const getMessageStyle = () => {
    switch (status) {
      case ResetStatus.Success:
        return `${styles.widget__text} ${styles['widget__text--success']}`
      case ResetStatus.Error:
        return `${styles.widget__text} ${styles['widget__text--error']}`
      case ResetStatus.Processing:
      default:
        return styles.widget__text
    }
  }

  const resetPassword = async () => {
    setStatus(ResetStatus.Processing)
    try {
      await api.post('/auth/reset-password', { token, password })
      setStatus(ResetStatus.Success)
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || '')
      setStatus(ResetStatus.Error)
    }
  }

  return (
    <div>
      <Head>
        <title>Chookgu Password Reset</title>
        <meta name="description" content="Reset your Chookgu password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout headless>
          <div className={styles.container}>
            <div className={`${styles.widget} ${styles['widget--centered']}`}>
              <Key className={styles.widget__icon} />
              <div className={styles.widget__text}>
                Enter your account email below. Once you hit send, we will send
                you a verification email with a link to reset your password.
              </div>
              <Field
                type="password"
                value={password}
                setValue={setPassword}
                description="Must be at least 10 characters long"
                validate={(val) => val.length >= 10}
                focused
              />
              <div className={getMessageStyle()}>{getMessage()}</div>
              <div className={styles.widget__footer}>
                <Button text="Reset Password" onClick={() => resetPassword()} />
                <Button
                  text="Home"
                  color="light"
                  onClick={() => router.push('/')}
                />
              </div>
            </div>
          </div>
        </Layout>
      </main>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<PasswordResetProps> = async ({
  query,
}) => {
  if (query.token && typeof query.token === 'string') {
    // confirm that token exists on the database
    try {
      const response = await api.get<TokenStatus>(
        `/auth/pw-token-status?token=${query.token}`
      )
      if (response.data && response.data.active) {
        return { props: { token: query.token } }
      }
    } catch (err) {
      if (err.response) {
        console.error(err.response)
      }
    }
  }

  return { notFound: true }
}

export default PasswordReset
