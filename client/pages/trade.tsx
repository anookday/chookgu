import { ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import Scroll from '@components/Scroll'
import Button from '@components/Button'
import PlayerCard from '@components/PlayerCard'
import Chart from '@components/Chart'
import { GlobalProps, getGlobalProps } from '@utils/GlobalContext'
import {
  Player,
  getPlayerAge,
  getPlayerCurrentValue,
  getPlayerValueChartData,
  getPlayerValueChartOptions,
} from '@utils/Player'
import api from '@utils/api'
import styles from '@styles/pages/Trade.module.scss'
import Search from '@components/Search'
import Dropdown from '@components/Dropdown'
import SortDropdown from '@components/SortDropdown'

interface SearchOptions {
  index: number
  term: string
  sortBy: string
  sortOrder: number
}

const Trade = (props: GlobalProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    index: 0,
    term: '',
    sortBy: 'name',
    sortOrder: 1,
  })
  const [players, setPlayers] = useState<Player[]>([])
  const [selected, setSelected] = useState<Player | null>(null)

  useEffect(() => {
    fetchPlayers()
  }, [searchOptions])

  /**
   * Get a list of players from the server. Loads 10 at a time, starting from
   * given index. Generates a new list if a new search term is detected.
   * Otherwise, add the newly obtained list to the current list.
   */
  const fetchPlayers = async () => {
    const { index, term, sortBy, sortOrder } = searchOptions
    let fetchUrl = `/players?index=${
      10 * index
    }&sortBy=${sortBy}&sortOrder=${sortOrder}&search=${term || ''}`

    const result = await api.get<Player[]>(fetchUrl)

    if (searchOptions.index === 0) {
      setPlayers(result.data)
    } else {
      setPlayers([...players, ...result.data])
    }
  }

  /**
   * Player select event handler
   */
  const onPlayerSelected = (player: Player | null) => {
    setSelected(player)
  }

  /**
   * Search term change event handler
   */
  const onSearchTermChange = (search: string) => {
    setSelected(null)
    setSearchOptions({ ...searchOptions, index: 0, term: search })
  }

  /**
   * Render the list of player cards.
   */
  const renderPlayers = () => {
    return players.map((player) => (
      <PlayerCard
        selected={selected !== null && selected._id === player._id}
        onSelected={onPlayerSelected}
        key={player._id}
        player={player}
      />
    ))
  }

  /**
   * Render the player detail widget.
   */
  const renderDetails = () => {
    if (selected) {
      return (
        <>
          <div className={styles.container_widget__title}>{selected.name}</div>
          <div className={styles.container_widget__chart}>
            <Chart
              data={getPlayerValueChartData(selected.value)}
              options={getPlayerValueChartOptions()}
            />
          </div>
          <div className={styles.playerDetail}>
            <div className={styles.playerDetail_nationality}>
              <span className={styles.accentedText}>Nationality: </span>
              {selected.nationality.join(', ')}
            </div>
            <div className={styles.playerDetail_position}>
              <span className={styles.accentedText}>Position: </span>
              {selected.position}
            </div>
            <div className={styles.playerDetail_age}>
              <span className={styles.accentedText}>Age: </span>
              {getPlayerAge(selected.dateOfBirth)}
            </div>
            <div className={styles.playerDetail_team}>
              <span className={styles.accentedText}>Team: </span>
              {selected.team}
            </div>
            <div className={styles.playerDetail_value}>
              {getPlayerCurrentValue(selected.value)}
            </div>
          </div>
          <div className={styles.container_widget__bottom}>
            <Button text="Compare" />
            <Button text="Buy Now" />
          </div>
        </>
      )
    }

    return (
      <div className={styles.container_widget__title}>
        Select a player to see details.
      </div>
    )
  }

  /**
   * Page content
   */
  return (
    <Layout>
      <div className={styles.container}>
        <div className={`${styles.container_widget}`}>
          <div className={styles.container_widget__title}>Player Market</div>
          <div className={styles.container_widget__search}>
            <SortDropdown {...searchOptions} />
            <Search
              hint="Search for players, teams, positions and more"
              onChange={onSearchTermChange}
            />
          </div>
          <div className={styles.container_widget__list}>
            <Scroll
              index={searchOptions.index}
              next={() => {
                setSearchOptions({
                  ...searchOptions,
                  index: searchOptions.index + 1,
                })
              }}
            >
              {renderPlayers()}
            </Scroll>
          </div>
        </div>
        <div className={`${styles.container_widget}`}>{renderDetails()}</div>
      </div>
    </Layout>
  )
}

/**
 * Page template
 */
Trade.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta
          name="description"
          content="Description of chookgu"
          charSet="UTF-8"
        />
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
