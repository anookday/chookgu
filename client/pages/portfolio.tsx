import { ReactElement, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import MainLayout from '@components/MainLayout'
import Layout from '@components/Layout'
import GridContainer from '@components/GridContainer'
import PlayerCard, { ValueStyle } from '@components/PlayerCard'
import PlayerCheckout from '@components/PlayerCheckout'
import PlayerDetails from '@components/PlayerDetails'
import { GlobalProps, getGlobalProps } from '@context/GlobalContext'
import { usePortfolio } from '@context/PortfolioContext'
import styles from '@styles/pages/Portfolio.module.scss'
import { Player, PlayerAsset } from '@util/Player'
import { Portfolio } from '@util/Portfolio'
import { formatMargin, formatMarginPercent } from '@util/numbers'

const PortfolioPage = (props: GlobalProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [portfolio, setPortfolio] = usePortfolio()
  const [selected, setSelected] = useState<PlayerAsset | undefined>(undefined)
  const [checkout, setCheckout] = useState(false)

  const onPlayerSelected = (player?: Player) => {
    setCheckout(false)
    if (player) {
      setSelected(
        portfolio.players.find((asset) => asset.player._id === player._id)
      )
    } else {
      setSelected(undefined)
    }
  }

  const renderPlayerAssets = () => {
    return portfolio.players.map((asset, index) => {
      const assetValue = asset.averageValue
      const marketValue = asset.player.currentValue
      let style: ValueStyle = 'positive'
      if (assetValue == marketValue) {
        style = 'neutral'
      } else if (assetValue > marketValue) {
        style = 'negative'
      }

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
            value: `${asset.amount} × ${formatMargin(
              assetValue,
              marketValue
            )} (${formatMarginPercent(assetValue, marketValue)})`,
            style,
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
          portfolio={portfolio}
          onComplete={(p) => setPortfolio(p)}
          onCancel={() => {
            setCheckout(false)
            if (selected) {
              setSelected(
                portfolio.players.find(
                  (asset) => asset.player._id === selected.player._id
                )
              )
            }
          }}
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

PortfolioPage.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu</title>
        <meta name="description" content="Description of chookgu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout selected="Portfolio" {...props}>
        {page}
      </MainLayout>
    </div>
  )
}

export const getServerSideProps = getGlobalProps

export default PortfolioPage
