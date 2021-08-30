import type { ReactElement } from 'react'
import Head from 'next/head'
import MainLayout from '@components/MainLayout'
import Dashboard from '@components/Dashboard'
import { UserProps, getUserProps } from 'context/UserContext'

const Home = () => {
  return <Dashboard />
}

Home.getLayout = (page: ReactElement) => {
  const props: UserProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MainLayout selected={0} {...props}>
          {page}
        </MainLayout>
      </main>
      <footer></footer>
    </div>
  )
}

export const getServerSideProps = getUserProps

export default Home
