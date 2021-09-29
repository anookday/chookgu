import { ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import GridContainer from '@components/GridContainer'
import Layout from '@components/Layout'
import Scroll from '@components/Scroll'
import PlayerCard from '@components/PlayerCard'
import PlayerDetails from '@components/PlayerDetails'
import { UserProps, getUserProps } from '@context/UserContext'
import { Player } from '@utils/Player'
import api from '@utils/api'
import styles from '@styles/pages/Trade.module.scss'
import Search from '@components/Search'
import SortDropdown, { SortBy, SortOrder } from '@components/SortDropdown'
import PlayerCheckout from '@components/PlayerCheckout'

interface SearchOptions {
  index: number
  term: string
  sortBy: SortBy
  sortOrder: SortOrder
}

const Trade = (props: UserProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    index: 0,
    term: '',
    sortBy: SortBy.Name,
    sortOrder: SortOrder.Asc,
  })
  const [players, setPlayers] = useState<Player[]>([])
  const [selected, setSelected] = useState<Player | undefined>(undefined)
  const [checkout, setCheckout] = useState(false)
  const [season, setSeason] = useState('standard')

  // fetch players every time search options change
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
  const onPlayerSelected = (player?: Player) => {
    setCheckout(false)
    setSelected(player)
  }

  /**
   * Search term change event handler
   */
  const onSearchTermChange = (term: string) => {
    //setSelected(undefined)
    setSearchOptions({ ...searchOptions, index: 0, term })
  }

  /**
   * Sort options change event handler
   */
  const onSortOptionsChange = (sortBy: SortBy, sortOrder: SortOrder) => {
    //setSelected(undefined)
    setSearchOptions({ ...searchOptions, index: 0, sortBy, sortOrder })
  }

  /**
   * Render the list of player cards.
   */
  const renderPlayers = () => {
    return players.map((player) => (
      <PlayerCard
        selected={(selected && selected._id === player._id) || undefined}
        onSelected={onPlayerSelected}
        key={player._id}
        player={player}
        size="small"
        format="default"
      />
    ))
  }

  const renderDetails = () => {
    if (selected && checkout) {
      return (
        <PlayerCheckout
          className={styles.details}
          player={selected}
          season={season}
          onBack={() => setCheckout(false)}
        />
      )
    }
    return (
      <PlayerDetails
        className={styles.details}
        player={selected}
        onTransactionClick={() => setCheckout(true)}
        onCloseClick={() => setSelected(undefined)}
      />
    )
  }

  /**
   * Page content
   */
  return (
    <Layout>
      <GridContainer>
        <div className={`${styles.widget} ${styles.players}`}>
          <div className={styles.widget__header}>Player Market</div>
          <div className={styles.widget__search}>
            <Search
              hint="Search for players, teams, positions and more"
              onChange={onSearchTermChange}
            />
            <SortDropdown
              sortBy={searchOptions.sortBy}
              sortOrder={searchOptions.sortOrder}
              onSelected={onSortOptionsChange}
            />
          </div>
          <div className={styles.widget__list}>
            <Scroll
              id="buyPlayers"
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
        {renderDetails()}
      </GridContainer>
    </Layout>
  )
}

/**
 * Page template
 */
Trade.getLayout = (page: ReactElement) => {
  const props: UserProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected="Trade" {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getUserProps

export default Trade
