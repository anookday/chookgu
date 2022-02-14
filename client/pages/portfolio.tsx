import { ReactElement, useEffect, useState } from 'react'
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
import { formatMargin, formatMarginPercent } from '@util/numbers'
import PlayerChart from '@components/PlayerChart'
import { Portfolio } from '@util/Portfolio'

const PortfolioPage = (props: GlobalProps) => {
  // redirect if user is not authenticated
  const router = useRouter()
  if (!props.loggedIn) {
    router.push('/')
  }

  const [portfolio, setPortfolio] = usePortfolio()
  const [selected, setSelected] = useState<PlayerAsset | undefined>(undefined)

  const onTransactionComplete = (portfolio: Portfolio) => {
    setPortfolio(portfolio)
    if (selected) {
      setSelected(
        portfolio.players.find((p) => p.player._id === selected.player._id)
      )
    }
  }

  const onPlayerSelected = (player?: Player) => {
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
            value: formatMargin(assetValue, marketValue, asset.amount, true),
            style,
          }}
        />
      )
    })
  }

  return (
    <Layout>
      <GridContainer className={styles.grid}>
        <div className={`${styles.widget} ${styles.grid__players}`}>
          <div className={styles.widget__header}>My Players</div>
          <div className={styles.widget__list}>{renderPlayerAssets()}</div>
        </div>
        <PlayerDetails className={styles.details} player={selected} />
        <PlayerCheckout
          className={styles.details}
          player={selected}
          portfolio={portfolio}
          onComplete={onTransactionComplete}
        />
        <PlayerChart className={styles.grid__chart} player={selected} />
      </GridContainer>
    </Layout>
  )
}

PortfolioPage.getLayout = (page: ReactElement) => {
  const props: GlobalProps = page.props

  return (
    <div>
      <Head>
        <title>Chookgu - My Portfolio</title>
        <meta
          name="description"
          content="View, analyze and sell football players in your portfolio."
        />
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
