import { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import EditField from '@components/EditField'
import { GlobalProps, getGlobalProps } from '@context/GlobalContext'
import { useUser } from '@context/UserContext'
import widgetStyles from '@styles/components/SingleWidget.module.scss'
import formStyles from '@styles/components/Form.module.scss'
import api from '@util/api'
import { User } from '@util/User'

const Account = (props: GlobalProps) => {
  const router = useRouter()
  const [user, setUser] = useUser()

  if (!props.loggedIn) {
    router.push('/')
  }

  const onUsernameSave = async (username: string) => {
    const result = await api.patch<User>('user', { username })
    setUser(result.data)
  }

  const isUsernameValid = (username: string) => {
    return username.length > 0 && username.length <= 30
  }

  const onPasswordSave = async (password: string) => {
    const result = await api.patch<User>('user', { password })
    setUser(result.data)
  }

  const isPasswordValid = (password: string) => {
    return password.length >= 10
  }

  return (
    <Layout>
      <div className={widgetStyles.container}>
        <div className={widgetStyles.widget}>
          <div className={widgetStyles.widget__header}>My Profile</div>
          <form className={formStyles.form}>
            <label className={formStyles.field}>
              <span className={formStyles.field__title}>Email</span>
              <input
                className={formStyles.field__input}
                type="text"
                value={user.email}
                disabled
              />
              <p className={formStyles.field__description}>
                Must be a valid, unique email
              </p>
            </label>
            <EditField
              type="text"
              label="Display name"
              value={user.username}
              description="Must be between 1 and 30 characters"
              validate={isUsernameValid}
              onSave={onUsernameSave}
            />
            <EditField
              type="password"
              label="Password"
              value="********************"
              description="Must be at least 10 characters long"
              validate={isPasswordValid}
              onSave={onPasswordSave}
            />
          </form>
          <div className={widgetStyles.widget__footer}></div>
        </div>
      </div>
    </Layout>
  )
}

Account.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout {...props}>{page}</MainLayout>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Account
