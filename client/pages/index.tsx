import { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Chart from '@components/Chart'
import Layout from '@components/Layout'
import MainLayout from '@components/MainLayout'
import PlayerCard from '@components/PlayerCard'
import GridContainer from '@components/GridContainer'
import { GlobalProps, getGlobalProps } from '@context/GlobalContext'
import styles from '@styles/pages/Home.module.scss'
import api from '@util/api'
import { Player } from '@util/Player'
import { PortfolioValue } from '@util/Portfolio'
import {
  getPortfolioValueChartData,
  getValueLineChartOptions,
} from '@util/chart'

const Home = (props: GlobalProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [portfolioValue, setPortfolioValue] = useState<PortfolioValue[]>([])
  const [topMargins, setTopMargins] = useState<Player[]>([])
  const [bottomMargins, setBottomMargins] = useState<Player[]>([])

  const getDashboardStatistics = async () => {
    const getTopMargins = await api.get<Player[]>('/players/top-margins')
    setTopMargins(getTopMargins.data)
    const getBottomMargins = await api.get<Player[]>('/players/bottom-margins')
    setBottomMargins(getBottomMargins.data)
  }

  useEffect(() => {
    getPortfolioValue()
    getDashboardStatistics()
  }, [])

  const getPortfolioValue = async () => {
    const res = await api.get<PortfolioValue[]>(
      '/portfolio/value?season=standard'
    )
    setPortfolioValue(res.data)
  }

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
          <div className={styles.widget__header}>Portfolio Value</div>
          <div className={styles.widget__chart}>
            <Chart
              data={getPortfolioValueChartData(portfolioValue)}
              options={getValueLineChartOptions()}
            />
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
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected="Home" {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Home
