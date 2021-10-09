import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Button from '@components/Button'
import Layout from '@components/Layout'
import CheckMark from '@public/checkmark.svg'
import api from '@util/api'
import styles from '@styles/components/SingleWidget.module.scss'

const Verify = () => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Chookgu Verification</title>
        <meta name="description" content="Verification page for Chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout headless>
          <div className={styles.container}>
            <div className={`${styles.widget} ${styles['widget--centered']}`}>
              <CheckMark className={styles.widget__icon} />
              <div className={styles.widget__text}>
                You have been <span>verified</span>. Welcome to Chookgu!
              </div>
              <div className={styles.widget__footer}>
                <Button
                  text="Go To Home Page"
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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query.token) {
    try {
      const response = await api.post(`/auth/verify?token=${query.token}`)

      if (response && response.status === 200) {
        return { props: {} }
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data)
      }
    }
  }

  return { notFound: true }
}

export default Verify
