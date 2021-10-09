import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Field from '@components/Field'
import Layout from '@components/Layout'
import Button from '@components/Button'
import Email from '@public/email.svg'
import styles from '@styles/components/SingleWidget.module.scss'
import api from '@util/api'

interface RecoverProps {
  email: string
}

enum EmailStatus {
  Ready,
  Processing,
  Sent,
  Error,
}

const Recover = (props: RecoverProps) => {
  const [email, setEmail] = useState(props.email)
  const [status, setStatus] = useState<EmailStatus>(EmailStatus.Ready)
  const router = useRouter()

  const getMessage = () => {
    switch (status) {
      case EmailStatus.Processing:
        return 'Sending...'
      case EmailStatus.Sent:
        return 'Email sent!'
      case EmailStatus.Error:
        return 'Unable to send email. Please try again.'
      default:
        return ''
    }
  }

  const getMessageStyle = () => {
    switch (status) {
      case EmailStatus.Sent:
        return `${styles.widget__text} ${styles['widget__text--success']}`
      case EmailStatus.Error:
        return `${styles.widget__text} ${styles['widget__text--error']}`
      case EmailStatus.Processing:
      default:
        return styles.widget__text
    }
  }

  const sendEmail = async () => {
    setStatus(EmailStatus.Processing)
    try {
      await api.post(`/auth/send-password-reset?email=${email}`)
      setStatus(EmailStatus.Sent)
    } catch (e) {
      console.error(e)
      setStatus(EmailStatus.Error)
    }
  }

  return (
    <div>
      <Head>
        <title>Chookgu Password Reset Request</title>
        <meta
          name="description"
          content="Request to reset your Chookgu password"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout headless>
          <div className={styles.container}>
            <div className={`${styles.widget} ${styles['widget--centered']}`}>
              <Email className={styles.widget__icon} />
              <div className={styles.widget__text}>
                Enter your account email below. Once you hit send, we will send
                you a verification email with a link to reset your password.
              </div>
              <Field type="text" value={email} setValue={setEmail} focused />
              <div className={getMessageStyle()}>{getMessage()}</div>
              <div className={styles.widget__footer}>
                <Button text="Send Email" onClick={() => sendEmail()} />
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

export const getServerSideProps: GetServerSideProps<RecoverProps> = async ({
  query,
}) => {
  let props: RecoverProps = {
    email: '',
  }

  if (query && query.email && typeof query.email == 'string') {
    props.email = query.email
  }

  return {
    props,
  }
}

export default Recover
