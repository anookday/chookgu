import { useState } from 'react'
import Button from '@components/Button'
import styles from '@styles/components/PlayerTransaction.module.scss'
import { Player, PlayerAsset, isPlayerAsset } from '@util/Player'
import { Portfolio } from '@util/Portfolio'
import PlayerBuy from '@components/PlayerBuy'
import api from '@util/api'
import PlayerSell from './PlayerSell'

enum TransactionStatus {
  Ready,
  Processing,
  Success,
  Failed,
}

interface PlayerCheckoutProps {
  player?: Player | PlayerAsset
  portfolio: Portfolio
  className?: string
  onComplete?: (portfolio: Portfolio) => void
}

/**
 * Player checkout component
 */
const PlayerCheckout = ({
  className,
  player,
  portfolio,
  onComplete,
}: PlayerCheckoutProps) => {
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Ready
  )

  const style = className ? `${styles.widget} ${className}` : styles.widget

  // no player selected
  if (!player) {
    return (
      <div className={style}>
        <div className={styles.widget__header}>
          Select a player to buy/sell.
        </div>
      </div>
    )
  }

  const onTransaction = async (
    type: 'buy' | 'sell',
    season: string,
    playerId: number,
    amount: number
  ) => {
    setStatus(TransactionStatus.Processing)
    try {
      const result = await api.post<Portfolio>(`/portfolio/${type}`, {
        season,
        playerId,
        amount,
      })
      setStatus(TransactionStatus.Success)
      onComplete && onComplete(result.data)
    } catch (err: any) {
      console.error(err?.response)
      setStatus(TransactionStatus.Failed)
    }
  }

  switch (status) {
    // transaction is processing
    case TransactionStatus.Processing:
      return (
        <div className={styles.widget}>
          <div>Processing...</div>
          <div className={styles.widget__footer}></div>
        </div>
      )
    // transaction succeeded
    case TransactionStatus.Success:
      return (
        <div className={styles.widget}>
          <div>Success!</div>
          <div className={styles.widget__footer}>
            <Button
              text="Proceed"
              onClick={() => setStatus(TransactionStatus.Ready)}
            />
          </div>
        </div>
      )
    // transaction failed
    case TransactionStatus.Failed:
      return (
        <div className={styles.widget}>
          <div>Transaction failed. Try again later.</div>
          <div className={styles.widget__footer}>
            <Button
              text="Go Back"
              onClick={() => setStatus(TransactionStatus.Ready)}
            />
          </div>
        </div>
      )
    // transaction is ready to be processed
    default:
      return isPlayerAsset(player) ? (
        <PlayerSell
          asset={player}
          portfolio={portfolio}
          onSell={onTransaction}
        />
      ) : (
        <PlayerBuy
          player={player}
          portfolio={portfolio}
          onBuy={onTransaction}
        />
      )
  }
}

export default PlayerCheckout
