import { useState } from 'react'
import Button from '@components/Button'
import api from '@util/api'
import { getValueString } from '@util/numbers'
import { Player, PlayerAsset, isPlayerAsset } from '@util/Player'
import { User } from '@util/User'
import { useUser } from '@context/UserContext'
import styles from '@styles/components/PlayerCheckout.module.scss'

enum TransactionStatus {
  Ready,
  Processing,
  Success,
  Failed,
}

interface PlayerCheckoutProps {
  className?: string
  player: Player | PlayerAsset
  season: string
  // function to call whenever user navigates away from checkout component
  onBack?: () => void
  // function to call as soon as transaction succeeds
  onComplete?: () => Promise<void>
}

const PlayerCheckout = ({
  className,
  player,
  season,
  onBack,
  onComplete,
}: PlayerCheckoutProps) => {
  const { user, setUser } = useUser()
  const [amount, setAmount] = useState(1)
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Ready
  )

  const portfolio = user.portfolio.find(({ mode }) => mode === season)
  const minAmount = 1
  const style = className ? `${styles.widget} ${className}` : styles.widget

  let maxAmount: number
  let currentValue: number
  let playerId: number
  let playerName: string
  let apiEndpoint: string
  let inputLabel: string
  let newBalance: number

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setAmount(minAmount)
    }

    let newAmount = parseInt(event.target.value)

    if (!newAmount || newAmount < minAmount) return

    if (newAmount > maxAmount) {
      newAmount = maxAmount
    }

    setAmount(newAmount)
  }

  const sendTransaction = async () => {
    setStatus(TransactionStatus.Processing)
    try {
      const result = await api.post<User>(apiEndpoint, {
        season,
        playerId: playerId,
        amount,
      })
      setStatus(TransactionStatus.Success)
      setUser(result.data)
      onComplete && (await onComplete())
    } catch (e) {
      setStatus(TransactionStatus.Failed)
    }
  }

  const renderContent = () => {
    // render if invalid season is given
    if (!portfolio) {
      return (
        <div className={style}>
          <div>An unexpected error has occurred. Try refreshing the page.</div>
          <div className={styles.widget__footer}>
            <Button text="Go Back" onClick={() => onBack && onBack()} />
          </div>
        </div>
      )
    }

    // render if user cannot afford the minimum
    if (!isPlayerAsset(player) && portfolio.balance < player.currentValue) {
      return (
        <>
          <div>Insufficient funds.</div>
          <div className={styles.widget__footer}>
            <Button text="Go Back" onClick={() => onBack && onBack()} />
          </div>
        </>
      )
    }

    // render based on transaction state
    switch (status) {
      case TransactionStatus.Processing:
        return (
          <>
            <div>Processing...</div>
            <div className={styles.widget__footer}></div>
          </>
        )
      case TransactionStatus.Success:
        return (
          <>
            <div>Success!</div>
            <div className={styles.widget__footer}>
              <Button text="Proceed" onClick={() => onBack && onBack()} />
            </div>
          </>
        )
      case TransactionStatus.Failed:
        return (
          <>
            <div>Transaction failed. Try again later.</div>
            <div className={styles.widget__footer}>
              <Button text="Go Back" onClick={() => onBack && onBack()} />
            </div>
          </>
        )

      default:
        return (
          <>
            <div className={styles.amount}>
              <label className={styles.amount__label}>{inputLabel}</label>
              <div className={styles.amount__input}>
                <input
                  type="number"
                  value={amount}
                  min={minAmount}
                  max={maxAmount}
                  onChange={onAmountChange}
                  onFocus={(event) => event.target.select()}
                />
              </div>
            </div>
            <div className={styles.widget__text}>
              <span>Current balance:</span>
              <span>{getValueString(portfolio.balance)}</span>
            </div>
            <div className={styles.widget__text}>
              <span>Price:</span>
              <span>{getValueString(currentValue * amount)}</span>
            </div>
            <div className={styles.widget__text}>
              <span>Balance after transaction:</span>
              <span>{getValueString(newBalance)}</span>
            </div>
            <div className={styles.widget__footer}>
              <Button
                text="Go Back"
                color="light"
                onClick={() => onBack && onBack()}
              />
              <Button text="Confirm" onClick={() => sendTransaction()} />
            </div>
          </>
        )
    }
  }

  if (!portfolio) {
    return renderContent()
  }

  if (isPlayerAsset(player)) {
    currentValue = player.player.currentValue
    maxAmount = player.amount
    playerId = player.player._id
    playerName = player.player.name
    apiEndpoint = '/transaction/sell'
    inputLabel = 'Amount to sell:'
    newBalance = portfolio.balance + currentValue * amount
  } else {
    currentValue = player.currentValue
    maxAmount = Math.floor(portfolio.balance / currentValue)
    playerId = player._id
    playerName = player.name
    apiEndpoint = '/transaction/buy'
    inputLabel = 'Amount to buy:'
    newBalance = portfolio.balance - currentValue * amount
  }

  return (
    <div className={style}>
      <div className={styles.widget__header}>{playerName}</div>
      {renderContent()}
    </div>
  )
}

export default PlayerCheckout
