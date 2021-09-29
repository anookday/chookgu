import { ReactElement } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import { UserProps, getUserProps } from '@context/UserContext'

const Tournaments = (props: UserProps) => {
  const router = useRouter()

  if (!props.loggedIn) {
    router.push('/')
  }

  return (
    <Layout>
      <div>Tournaments</div>
    </Layout>
  )
}

Tournaments.getLayout = (page: ReactElement) => {
  const props: UserProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected="Tournaments" {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getUserProps

export default Tournaments
