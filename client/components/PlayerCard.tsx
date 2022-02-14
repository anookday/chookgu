import Image from 'next/image'
import { Player, getPlayerAge } from '@util/Player'
import { formatValue, formatPercent } from '@util/numbers'
import styles from '@styles/components/PlayerCard.module.scss'

export type CardSize = 'default' | 'small'
export type ValueFormat = 'default' | 'margin' | 'custom'
export type ValueStyle = 'positive' | 'negative' | 'neutral'

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
      case 'custom':
        if (customFormatOptions) {
          let style = styles.player__value
          switch (customFormatOptions.style) {
            case 'negative':
              style += ' ' + styles['player__value--negative']
              break
            case 'neutral':
              style += ' ' + styles['player__value--neutral']
              break
          }

          return <div className={style}>{customFormatOptions.value}</div>
        }

      default:
        return (
          <div className={styles.player__value}>
            {formatValue(player.currentValue, true)}
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
        <Image
          src={player.image}
          alt={`photo of ${player.name}`}
          layout="fill"
          objectFit="cover"
        />
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
