import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Form, { FormProps } from '@components/Form'
import Logo from '@public/player.svg'
import api from '@utils/api'
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
      await api.post(`/auth/login?email=${email}&password=${password}`)
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
            <div className={styles.userForm}>
              <Link href="/">
                <a>
                  <Logo className={styles.userForm_logo} />
                </a>
              </Link>
              <div className={styles.userForm_formWrapper}>
                <h1 className={styles.userForm_title}>Login</h1>
                <Form {...formProps} />
                <p className={styles.userForm_error}>{error}</p>
              </div>
              <div className={styles.redirect}>
                <Link href="/account/register">
                  <a className={styles.redirect_link}>Sign up</a>
                </Link>
                <Link href="/account/recover">
                  <a className={styles.redirect_link}>Forgot password</a>
                </Link>
              </div>
              <p className="login__legal">&copy; anookday 2021.</p>
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
