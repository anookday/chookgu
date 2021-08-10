import { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'
import Header from '../components/Header'
import { User, DatabaseUser } from '../util/User'
import server from '../util/server'

type HomeProps = {
  user?: User
}

const Home: NextPage<HomeProps> = ({ user }) => {
  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Chookgu description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Layout>
          <Header />
          <div className="content" style={{ color: '#fff' }}>
            {user ? `Welcome, ${user.username}` : 'Content'}
          </div>
        </Layout>
      </main>

      <footer></footer>
    </div>
  )
}

Home.getInitialProps = async ({ req }) => {
  let props: HomeProps = {}
  try {
    const profile = await server.get<DatabaseUser>('auth/profile', {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    })
    const { _id, __v, ...user } = profile.data
    props.user = user
  } catch (e) {
    console.log('authentication failed')
  }
  return props
}

export default Home
