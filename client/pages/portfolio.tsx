import { ReactElement, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import GridContainer from '@components/GridContainer'
import PlayerCard from '@components/PlayerCard'
import PlayerCheckout from '@components/PlayerCheckout'
import PlayerDetails from '@components/PlayerDetails'
import { UserProps, getUserProps } from '@context/UserContext'
import styles from '@styles/pages/Portfolio.module.scss'
import api from '@utils/api'
import { Player, PlayerAsset } from '@utils/Player'
import { getMarginString } from '@utils/numbers'
import { UserPortfolio } from '@utils/User'

const Portfolio = (props: UserProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [playerAssets, setPlayerAssets] = useState<PlayerAsset[]>([])
  const [selected, setSelected] = useState<PlayerAsset | undefined>(undefined)
  const [checkout, setCheckout] = useState(false)

  const getPortfolio = async () => {
    const response = await api.get<UserPortfolio>('/user/portfolio')
    setPlayerAssets(response.data.players || [])
  }

  useEffect(() => {
    getPortfolio()
  }, [])

  const onPlayerSelected = (player?: Player) => {
    setCheckout(false)
    if (player) {
      setSelected(playerAssets.find((asset) => asset.player._id === player._id))
    } else {
      setSelected(undefined)
    }
  }

  const onCheckoutBack = () => {
    setCheckout(false)
    if (
      selected &&
      !playerAssets.find((asset) => asset.player._id === selected.player._id)
    ) {
      setSelected(undefined)
    }
  }

  const onCheckoutComplete = async () => {
    await getPortfolio()
  }

  const renderPlayerAssets = () => {
    return playerAssets.map((asset, index) => {
      return (
        <PlayerCard
          key={index}
          player={asset.player}
          selected={
            (selected && selected.player._id === asset.player._id) || undefined
          }
          onSelected={onPlayerSelected}
          size="small"
          format="custom"
          customFormatOptions={{
            value: getMarginString(
              asset.averageValue,
              asset.player.currentValue,
              asset.amount
            ),
            style:
              asset.averageValue < asset.player.currentValue
                ? 'positive'
                : 'negative',
          }}
        />
      )
    })
  }

  const renderDetails = () => {
    if (selected && checkout) {
      return (
        <PlayerCheckout
          className={styles.details}
          player={selected}
          onBack={onCheckoutBack}
          onComplete={onCheckoutComplete}
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

  return (
    <Layout>
      <GridContainer>
        <div className={`${styles.widget} ${styles.portfolio}`}>
          <div className={styles.widget__header}>My Players</div>
          <div className={styles.widget__list}>{renderPlayerAssets()}</div>
        </div>
        {renderDetails()}
      </GridContainer>
    </Layout>
  )
}

Portfolio.getLayout = (page: ReactElement) => {
  const props: UserProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected={1} {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getUserProps

export default Portfolio
