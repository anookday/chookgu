import Chart, { toChartValues } from '@components/LineChart'
import { Player, PlayerAsset, isPlayerAsset } from '@util/Player'
import styles from '@styles/components/PlayerDetails.module.scss'

interface PlayerChartProps {
  className?: string
  player?: Player | PlayerAsset
}

const PlayerChart = ({ className, player }: PlayerChartProps) => {
  const style = className ? `${styles.widget} ${className}` : styles.widget

  if (!player) {
    return (
      <div className={style}>
        <div className={styles.widget__header}>
          Select a player to see their historical value.
        </div>
      </div>
    )
  }

  let playerInfo: Player
  let threshold: number | undefined

  if (isPlayerAsset(player)) {
    playerInfo = player.player
    threshold = player.averageValue
  } else {
    playerInfo = player
  }

  const data = toChartValues(playerInfo.value)

  return (
    <div className={style}>
      <div className={styles.widget__chart}>
        <Chart data={data} threshold={threshold} />
      </div>
    </div>
  )
}

export default PlayerChart
