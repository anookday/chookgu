import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Form, { FormProps } from '../../components/Form'
import Logo from '../../public/player.svg'
import server from '../../util/server'
import styles from '../../styles/pages/Login.module.scss'

const Login = () => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setError('')
    try {
      await server.post(`/auth/login?email=${username}&password=${password}`)
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
    username,
    setUsername,
    password,
    setPassword,
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
            <div className={styles.login}>
              <Logo className={styles.login__logo} />
              <div className={styles.login__form}>
                <h1 className={styles.login__title}>Login</h1>
                <Form {...formProps} />
                <p className={styles.login__error}>{error}</p>
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
