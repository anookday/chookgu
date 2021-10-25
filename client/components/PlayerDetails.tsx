import Chart, { toChartValues } from '@components/LineChart'
import Button from '@components/Button'
import { formatMargin, formatValue, formatMarginPercent } from '@util/numbers'
import { Player, PlayerAsset, isPlayerAsset, getPlayerAge } from '@util/Player'
import styles from '@styles/components/PlayerDetails.module.scss'

interface PlayerDetailsProps {
  className?: string
  player?: Player | PlayerAsset
  onTransactionClick: () => void
  onCloseClick: () => void
}

const PlayerDetails = ({
  className,
  player,
  onTransactionClick,
  onCloseClick,
}: PlayerDetailsProps) => {
  const style = className ? `${styles.widget} ${className}` : styles.widget

  if (!player) {
    return (
      <div className={style}>
        <div className={styles.widget__header}>
          Select a player to see details.
        </div>
      </div>
    )
  }

  let playerInfo: Player
  let transactionTitle: string
  let threshold: number | undefined

  if (isPlayerAsset(player)) {
    playerInfo = player.player
    transactionTitle = 'Sell'
    threshold = player.averageValue
  } else {
    playerInfo = player
    transactionTitle = 'Buy'
  }

  const data = toChartValues(playerInfo.value)

  const renderInfo = () => {
    if (isPlayerAsset(player)) {
      const averageMargin = formatMargin(
        player.averageValue,
        playerInfo.currentValue
      )
      const totalMargin = formatMargin(
        player.averageValue,
        playerInfo.currentValue,
        player.amount
      )
      const marginPercent = formatMarginPercent(
        player.averageValue,
        playerInfo.currentValue
      )

      return (
        <div className={styles.asset}>
          <div>
            <span className={styles.infoLabel}>Stock value: </span>
            {formatValue(player.averageValue)}
          </div>
          <div>
            <span className={styles.infoLabel}>Market value: </span>
            {formatValue(playerInfo.currentValue)}
          </div>
          <div>
            <span className={styles.infoLabel}>Total value: </span>
            {formatValue(player.averageValue * player.amount)}
          </div>
          <div>
            <span className={styles.infoLabel}>Average Margin: </span>
            {averageMargin}
          </div>
          <div>
            <span className={styles.infoLabel}>Total Margin: </span>
            {totalMargin}
          </div>
          <div>
            <span className={styles.infoLabel}>Percent Margin: </span>
            {marginPercent}
          </div>
          <div>
            <span className={styles.infoLabel}>Stocks: </span>
            {player.amount}
          </div>
        </div>
      )
    }

    return (
      <div className={styles.player}>
        <div className={styles.player__nationality}>
          <span className={styles.infoLabel}>Nationality: </span>
          {playerInfo.nationality.join(', ')}
        </div>
        <div className={styles.player__position}>
          <span className={styles.infoLabel}>Position: </span>
          {playerInfo.position}
        </div>
        <div className={styles.player__age}>
          <span className={styles.infoLabel}>Age: </span>
          {getPlayerAge(playerInfo.dateOfBirth)}
        </div>
        <div className={styles.player__team}>
          <span className={styles.infoLabel}>Team: </span>
          {playerInfo.team}
        </div>
        <div className={styles.player__value}>
          {formatValue(playerInfo.currentValue)}
        </div>
      </div>
    )
  }

  return (
    <div className={style}>
      <div className={styles.widget__header}>
        <div className={styles.widget__header__title}>{playerInfo.name}</div>
        <div className={styles.widget__header__buttons}>
          <Button text="Compare" color="light" />
          <Button
            text={transactionTitle}
            onClick={() => onTransactionClick()}
          />
          <Button text="X" color="warning" onClick={() => onCloseClick()} />
        </div>
      </div>
      <div className={styles.widget__chart}>
        <Chart data={data} threshold={threshold} />
      </div>
      {renderInfo()}
    </div>
  )
}

export default PlayerDetails
