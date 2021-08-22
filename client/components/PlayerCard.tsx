import { Player, getPlayerAge, getPlayerCurrentValue } from '@utils/Player'
import styles from '@styles/components/PlayerCard.module.scss'

interface PlayerCardProps {
  player: Player
  key: number
  onSelected: (player: Player) => void
}

const PlayerCard = ({ player, onSelected }: PlayerCardProps) => {
  return (
    <div
      className={styles.player}
      onClick={() => {
        onSelected(player)
      }}
    >
      <div className={styles.player_image}>
        <img src={player.image} alt={`photo of ${player.name}`} />
      </div>
      <div className={styles.player_name}>{player.name}</div>
      <div className={styles.player_info}>
        <div className={styles.player_info__age}>
          {getPlayerAge(player.dateOfBirth)}
        </div>
        <div className={styles.player_info__nationality}>
          {player.nationality}
        </div>
        <div className={styles.player_info__position}>{player.position}</div>
        <div className={styles.player_info__team}>{player.team}</div>
      </div>
      <div className={styles.player_value}>
        {getPlayerCurrentValue(player.value)}
      </div>
    </div>
  )
}

export default PlayerCard
