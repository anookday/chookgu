import Chart from '@components/Chart'
import Button, { ButtonColor } from '@components/Button'
import { getValueString } from '@utils/Currency'
import {
  Player,
  getPlayerValueChartData,
  getPlayerValueChartOptions,
  getPlayerAge,
} from '@utils/Player'
import styles from '@styles/components/PlayerDetails.module.scss'

interface PlayerDetailsProps {
  player?: Player
  onBuyClick: () => void
}

const PlayerDetails = ({ player, onBuyClick }: PlayerDetailsProps) => {
  if (!player) {
    return (
      <div className={styles.widget}>
        <div className={styles.widget_header}>
          Select a player to see details.
        </div>
      </div>
    )
  }

  return (
    <div className={styles.widget}>
      <div className={styles.widget_header}>{player.name}</div>
      <div className={styles.widget_chart}>
        <Chart
          data={getPlayerValueChartData(player.value)}
          options={getPlayerValueChartOptions()}
        />
      </div>
      <div className={styles.player}>
        <div className={styles.player_nationality}>
          <span className={styles.accentedText}>Nationality: </span>
          {player.nationality.join(', ')}
        </div>
        <div className={styles.player_position}>
          <span className={styles.accentedText}>Position: </span>
          {player.position}
        </div>
        <div className={styles.player_age}>
          <span className={styles.accentedText}>Age: </span>
          {getPlayerAge(player.dateOfBirth)}
        </div>
        <div className={styles.player_team}>
          <span className={styles.accentedText}>Team: </span>
          {player.team}
        </div>
        <div className={styles.player_value}>
          {getValueString(player.currentValue, true)}
        </div>
      </div>
      <div className={styles.widget_footer}>
        <Button text="Compare" color={ButtonColor.Light} />
        <Button text="Buy Now" onClick={() => onBuyClick()} />
      </div>
    </div>
  )
}

export default PlayerDetails
