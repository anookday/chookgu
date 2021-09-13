import { Player, getPlayerAge } from '@utils/Player'
import { getValueString, getPercent } from '@utils/numbers'
import styles from '@styles/components/PlayerCard.module.scss'

type CardSize = 'default' | 'small'
type ValueFormat = 'default' | 'margin' | 'custom'
type ValueStyle = 'positive' | 'negative'

interface PlayerCardProps {
  player: Player
  size?: CardSize
  format?: ValueFormat
  onSelected?: (player?: Player) => void
  selected?: true
  customFormatOptions?: {
    value: string
    style: ValueStyle
  }
}

const PlayerCard = ({
  player,
  size,
  onSelected,
  selected,
  format,
  customFormatOptions,
}: PlayerCardProps) => {
  const onClick = () => {
    if (selected) {
      onSelected && onSelected()
    } else {
      onSelected && onSelected(player)
    }
  }

  const renderValue = () => {
    switch (format) {
      case 'margin':
        const margin = getValueString(player.margin || 0, true, true)
        const ratio = getPercent(player.marginRatio || 0)
        let style = styles.player__value
        if (player.margin && player.margin < 0) {
          style += ' ' + styles['player__value--negative']
        }

        return <div className={style}>{`${margin} (${ratio})`}</div>

      case 'custom':
        if (customFormatOptions) {
          let style = styles.player__value
          if (customFormatOptions.style === 'negative') {
            style += ' ' + styles['player__value--negative']
          }

          return <div className={style}>{customFormatOptions.value}</div>
        }

      default:
        return (
          <div className={styles.player__value}>
            {getValueString(player.currentValue, true)}
          </div>
        )
    }
  }

  const getCardStyle = () => {
    let style = styles.player
    if (selected) {
      style += ' ' + styles['player--selected']
    }
    if (size && size === 'small') {
      style += ' ' + styles['player--small']
    }

    return style
  }

  return (
    <div key={player._id} className={getCardStyle()} onClick={onClick}>
      <div className={styles.player__image}>
        <img src={player.image} alt={`photo of ${player.name}`} />
      </div>
      <div className={styles.player__name}>{player.name}</div>
      <div className={styles.player__info}>
        <div className={styles.player__age}>
          {getPlayerAge(player.dateOfBirth)}
        </div>
        <div className={styles.player__nationality}>{player.nationality}</div>
        <div className={styles.player__position}>{player.position}</div>
        <div className={styles.player__team}>{player.team}</div>
      </div>
      {renderValue()}
    </div>
  )
}

export default PlayerCard
