import { Player, getPlayerAge, getPlayerCurrentValue } from '@utils/Player'
import styles from '@styles/components/PlayerCard.module.scss'

interface PlayerCardProps {
  player: Player
  key: number
  selected: boolean
  onSelected: (player: Player | null) => void
}

const PlayerCard = ({ player, selected, onSelected }: PlayerCardProps) => {
  const onClick = () => {
    if (selected) {
      onSelected(null)
    } else {
      onSelected(player)
    }
  }

  return (
    <div
      className={`${styles.player}${
        selected ? ` ${styles.player_selected}` : ''
      }`}
      onClick={onClick}
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
