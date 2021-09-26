import { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '@components/Layout'
import MainLayout from '@components/MainLayout'
import PlayerCard from '@components/PlayerCard'
import GridContainer from '@components/GridContainer'
import { UserProps, getUserProps } from '@context/UserContext'
import styles from '@styles/pages/Home.module.scss'
import api from '@utils/api'
import { Player, PlayerAsset } from '@utils/Player'
import { UserPortfolio } from '@utils/User'
import { getMarginString, getPercent, getValueString } from '@utils/numbers'

const Home = (props: UserProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [playerAssets, setPlayerAssets] = useState<PlayerAsset[]>([])
  const [topMargins, setTopMargins] = useState<Player[]>([])
  const [bottomMargins, setBottomMargins] = useState<Player[]>([])

  const getPortfolio = async () => {
    const response = await api.get<UserPortfolio>('/user/portfolio')
    setPlayerAssets(response.data.players || [])
  }

  const getDashboardStatistics = async () => {
    const getTopMargins = await api.get<Player[]>('/players/top-margins')
    setTopMargins(getTopMargins.data)
    const getBottomMargins = await api.get<Player[]>('/players/bottom-margins')
    setBottomMargins(getBottomMargins.data)
  }

  useEffect(() => {
    getPortfolio()
    getDashboardStatistics()
  }, [])

  const renderPlayers = (players: Player[]) => {
    return players.map((player, index) => (
      <div key={index} className={styles.numberedItem}>
        <div className={styles.numberedItem__number}>{`#${index + 1}`}</div>
        <PlayerCard player={player} format="margin" size="small" />
      </div>
    ))
  }

  return (
    <Layout>
      <GridContainer>
        <div className={`${styles.widget} ${styles.portfolio}`}>
          <div className={styles.widget__header}>
            More cool statistics coming soon
          </div>
        </div>
        <div className={`${styles.widget} ${styles.topMargins}`}>
          <div className={styles.widget__header}>Top Gains</div>
          <div className={styles.widget__list}>{renderPlayers(topMargins)}</div>
        </div>
        <div className={`${styles.widget} ${styles.bottomMargins}`}>
          <div className={styles.widget__header}>Top Losses</div>
          <div className={styles.widget__list}>
            {renderPlayers(bottomMargins)}
          </div>
        </div>
      </GridContainer>
    </Layout>
  )
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
      <MainLayout selected={0} {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getUserProps

export default Home
