import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import Form, { FormProps } from '@components/Form'
import Logo from '@public/player.svg'
import api from '@utils/api'
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
      await api.post('/auth/profile', {
        email,
        username,
        password,
      })
      await api.post(`/auth/login?email=${email}&password=${password}`)
      router.push('/')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
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
            <div className={styles.userForm}>
              <Link href="/">
                <a>
                  <Logo className={styles.userForm_logo} />
                </a>
              </Link>
              <div className={styles.userForm_formWrapper}>
                <h1 className={styles.userForm_title}>Register</h1>
                <Form {...formProps} />
                <p className={styles.userForm_error}>{error}</p>
              </div>
              <div className={styles.redirect}>
                <span className={styles.redirect_text}>
                  Have an account?{' '}
                  <Link href="/account/login">
                    <a className={styles.redirect_link}>Log in</a>
                  </Link>
                </span>
              </div>
              <p className="login__legal">&copy; anookday 2021.</p>
            </div>
          </div>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}

export default Register
