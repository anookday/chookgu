import Image from 'next/image'
import { formatMargin, formatValue, formatMarginPercent } from '@util/numbers'
import { Player, PlayerAsset, isPlayerAsset, getPlayerAge } from '@util/Player'
import styles from '@styles/components/PlayerDetails.module.scss'

interface PlayerDetailsProps {
  className?: string
  player?: Player | PlayerAsset
}

const PlayerDetails = ({ className, player }: PlayerDetailsProps) => {
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

  const playerInfo = isPlayerAsset(player) ? player.player : player

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
        <div className={styles.player}>
          <div className={styles.player__info}>
            <div className={styles.player__details}>
              <div>
                <span className={styles.infoLabel}>Stock value: </span>
                {formatValue(player.averageValue)}
              </div>
              <div>
                <span className={styles.infoLabel}>Market value: </span>
                {formatValue(playerInfo.currentValue)}
              </div>
              <div>
                <span className={styles.infoLabel}>Owned: </span>
                {player.amount}
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
            </div>

            <div className={styles.player__photo}>
              <Image
                src={playerInfo.image}
                alt={`Photo of ${playerInfo.name}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.player}>
        <div className={styles.player__info}>
          <div className={styles.player__defails}>
            <span className={styles.infoLabel}>Nationality</span>
            <br />
            {playerInfo.nationality.join(', ')}
            <br />
            <span className={styles.infoLabel}>Position</span>
            <br />
            {playerInfo.position}
            <br />
            <span className={styles.infoLabel}>Age</span>
            <br />
            {getPlayerAge(playerInfo.dateOfBirth)}
            <br />
            <span className={styles.infoLabel}>Team</span>
            <br />
            {playerInfo.team}
          </div>
          <div className={styles.player__photo}>
            <Image
              src={playerInfo.image}
              alt={`Photo of ${playerInfo.name}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
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
      </div>
      {renderInfo()}
    </div>
  )
}

export default PlayerDetails
