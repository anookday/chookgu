import Head from 'next/head'
import Container from '../components/Container'
import Header from '../components/Header'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Chookgu description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <Header />
          <div className="content">Content</div>
        </Container>
      </main>

      <footer></footer>
    </div>
  )
}
