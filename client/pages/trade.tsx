import { ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import Scroll from '@components/Scroll'
import PlayerCard from '@components/PlayerCard'
import { GlobalProps, getGlobalProps } from '@utils/GlobalContext'
import { Player, getPlayerAge, getPlayerCurrentValue } from '@utils/Player'
import api from '@utils/api'
import styles from '@styles/pages/Trade.module.scss'

const Trade = (props: GlobalProps) => {
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [page, setPage] = useState(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [selected, setSelected] = useState<Player | null>(null)

  const fetchPlayers = async () => {
    const result = await api.get<Player[]>(
      `/players?index=${10 * page}&sortBy=${'name'}&sortOrder=${1}`
    )

    setPlayers([...players, ...result.data])
    setPage(page + 1)
  }

  const onPlayerSelected = (player: Player) => {
    setSelected(player)
  }

  const renderPlayers = () => {
    return players.map((player) => (
      <PlayerCard
        onSelected={onPlayerSelected}
        key={player._id}
        player={player}
      />
    ))
  }

  const renderDetails = () => {
    if (selected) {
      return (
        <div className={styles.detail_container}>
          <div className={styles.detail_player__name}>{selected.name}</div>
          <div className={styles.detail_player__name}>
            {selected.nationality.join(', ')}
          </div>
          <div className={styles.detail_player__name}>{selected.position}</div>
          <div className={styles.detail_player__name}>
            {getPlayerAge(selected.dateOfBirth)}
          </div>
          <div className={styles.detail_player__name}>{selected.team}</div>
          <div className={styles.detail_player__name}>
            {getPlayerCurrentValue(selected.value)}
          </div>
        </div>
      )
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.detail}>{renderDetails()}</div>
        <div className={styles.players}>
          <div className={styles.players_title}>
            <h1>Player Market</h1>
          </div>
          <div className={styles.players_list}>
            <Scroll next={fetchPlayers}>{renderPlayers()}</Scroll>
          </div>
        </div>
      </div>
    </Layout>
  )
}

Trade.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <MainLayout selected={1} {...props}>
          {page}
        </MainLayout>
      </main>
      <footer></footer>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default Trade
