import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Form, { FormProps } from '@components/Form'
import Logo from '@public/player.svg'
import api from '@util/api'
import styles from '@styles/components/UserForm.module.scss'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/login', { email, password })
      router.push('/')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid email/password.')
      } else {
        setError('Unknown error occurred. Please try again later.')
      }
    }
  }

  const formProps: FormProps = {
    email,
    setEmail,
    password,
    setPassword,
    submitText: 'Login',
    onSubmit,
  }

  return (
    <div>
      <Head>
        <title>Login to Chookgu</title>
        <meta name="description" content="Login page for Chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <div className={styles.form}>
              <Link href="/">
                <a>
                  <Logo className={styles.form__logo} />
                </a>
              </Link>
              <div className={styles.form__wrapper}>
                <h1 className={styles.form__title}>Login</h1>
                <Form {...formProps} />
                <p className={styles.form__error}>{error}</p>
              </div>
              <div className={styles.redirect}>
                <Link href="/account/register">
                  <a className={styles.redirect__link}>Sign up</a>
                </Link>
                <Link
                  href={{
                    pathname: '/account/recover',
                    query: {
                      email,
                    },
                  }}
                >
                  <a className={styles.redirect__link}>Forgot password</a>
                </Link>
              </div>
              <p>&copy; anookday 2021.</p>
            </div>
            <div className={styles.content}>
              <div>Content</div>
            </div>
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export default Login
