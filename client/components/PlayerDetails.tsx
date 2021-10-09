import { ChartData } from 'chart.js'
import Chart from '@components/Chart'
import Button from '@components/Button'
import { getMarginString, getValueString } from '@util/numbers'
import {
  Player,
  PlayerAsset,
  isPlayerAsset,
  getPlayerValueChartData,
  getPlayerValueChartOptions,
  getPlayerAge,
} from '@util/Player'
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
      return (
        <div className={styles.asset}>
          <div className={styles.asset__average}>
            <span className={styles.infoLabel}>Stock value: </span>
            {getValueString(player.averageValue)}
          </div>
          <div className={styles.asset__market}>
            <span className={styles.infoLabel}>Market value: </span>
            {getValueString(player.player.currentValue)}
          </div>
          <div className={styles.asset__amount}>
            <span className={styles.infoLabel}>Stocks: </span>
            {player.amount}
          </div>
          <div className={styles.asset__total}>
            <span className={styles.infoLabel}>Total value: </span>
            {getValueString(player.averageValue * player.amount)}
          </div>
          <div className={styles.asset__margin}>
            <span className={styles.infoLabel}>Margin: </span>
            {getMarginString(
              player.averageValue,
              player.player.currentValue,
              player.amount
            )}
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
          {getValueString(_player.currentValue)}
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
        <Chart data={chartData} options={getPlayerValueChartOptions()} />
      </div>
      {renderInfo()}
    </div>
  )
}

export default PlayerDetails
