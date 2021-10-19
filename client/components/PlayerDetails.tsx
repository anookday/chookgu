import { ChartData } from 'chart.js'
import Chart from '@components/Chart'
import Button from '@components/Button'
import { formatMargin, formatValue, formatMarginPercent } from '@util/numbers'
import { Player, PlayerAsset, isPlayerAsset, getPlayerAge } from '@util/Player'
import { getPlayerValueChartData, getValueLineChartOptions } from '@util/chart'
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

  let _player: Player
  let transBtnStr: string
  let chartData: ChartData

  if (isPlayerAsset(player)) {
    _player = player.player
    transBtnStr = 'Sell'
    chartData = getPlayerValueChartData(
      player.player.value,
      player.averageValue
    )
  } else {
    _player = player
    transBtnStr = 'Buy'
    chartData = getPlayerValueChartData(player.value)
  }

  const renderInfo = () => {
    if (isPlayerAsset(player)) {
      // player on the marketplace.
      // different from player, which is a user-owned player asset
      const mPlayer = player.player

      const averageMargin = formatMargin(
        player.averageValue,
        mPlayer.currentValue
      )
      const totalMargin = formatMargin(
        player.averageValue,
        mPlayer.currentValue,
        player.amount
      )
      const marginPercent = formatMarginPercent(
        player.averageValue,
        mPlayer.currentValue
      )

      return (
        <div className={styles.asset}>
          <div>
            <span className={styles.infoLabel}>Stock value: </span>
            {formatValue(player.averageValue)}
          </div>
          <div>
            <span className={styles.infoLabel}>Market value: </span>
            {formatValue(player.player.currentValue)}
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
          {_player.nationality.join(', ')}
        </div>
        <div className={styles.player__position}>
          <span className={styles.infoLabel}>Position: </span>
          {_player.position}
        </div>
        <div className={styles.player__age}>
          <span className={styles.infoLabel}>Age: </span>
          {getPlayerAge(_player.dateOfBirth)}
        </div>
        <div className={styles.player__team}>
          <span className={styles.infoLabel}>Team: </span>
          {_player.team}
        </div>
        <div className={styles.player__value}>
          {formatValue(_player.currentValue)}
        </div>
      </div>
    )
  }

  return (
    <div className={style}>
      <div className={styles.widget__header}>
        <div className={styles.widget__header__title}>{_player.name}</div>
        <div className={styles.widget__header__buttons}>
          <Button text="Compare" color="light" />
          <Button text={transBtnStr} onClick={() => onTransactionClick()} />
          <Button text="X" color="warning" onClick={() => onCloseClick()} />
        </div>
      </div>
      <div className={styles.widget__chart}>
        <Chart data={chartData} options={getValueLineChartOptions()} />
      </div>
      {renderInfo()}
    </div>
  )
}

export default PlayerDetails
