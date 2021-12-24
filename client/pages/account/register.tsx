import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Form, { FormProps } from '@components/Form'
import Logo from '@public/player.svg'
import api from '@util/api'
import styles from '@styles/components/UserForm.module.scss'

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/user', {
        email,
        username,
        password,
      })
      await api.post('/auth/login', { email, password })
      await api.post('/auth/send-confirmation')
      router.push('/')
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message)
      } else {
        setError('Unknown error occurred. Please try again later.')
      }
    }
  }

  const formProps: FormProps = {
    email,
    setEmail,
    username,
    setUsername,
    password,
    setPassword,
    submitText: 'Create account',
    onSubmit,
  }

  return (
    <div>
      <Head>
        <title>Register to Chookgu</title>
        <meta name="description" content="Registration page for Chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div>Content</div>
            </div>
            <div className={styles.form}>
              <Link href="/">
                <a>
                  <Logo className={styles.form__logo} />
                </a>
              </Link>
              <div className={styles.form__wrapper}>
                <h1 className={styles.form__title}>Register</h1>
                <Form {...formProps} />
                <p className={styles.form__error}>{error}</p>
              </div>
              <div className={styles.redirect}>
                <span>
                  Have an account?{' '}
                  <Link href="/account/login">
                    <a className={styles.redirect__link}>Log in</a>
                  </Link>
                </span>
              </div>
              <p>&copy; anookday 2021.</p>
            </div>
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export default Register
