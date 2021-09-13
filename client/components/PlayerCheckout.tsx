import { useState } from 'react'
import Button from '@components/Button'
import api from '@utils/api'
import { getValueString } from '@utils/numbers'
import { Player, PlayerAsset, isPlayerAsset } from '@utils/Player'
import { User } from '@utils/User'
import { useUser } from '@context/UserContext'
import styles from '@styles/components/PlayerCheckout.module.scss'

enum TransactionStatus {
  Ready,
  Processing,
  Success,
  Error,
}

interface PlayerCheckoutProps {
  className?: string
  player: Player | PlayerAsset
  // function to call whenever user navigates away from checkout component
  onBack?: () => void
  // function to call as soon as transaction succeeds
  onComplete?: () => Promise<void>
}

const PlayerCheckout = ({
  className,
  player,
  onBack,
  onComplete,
}: PlayerCheckoutProps) => {
  const { user, setUser } = useUser()
  const [amount, setAmount] = useState(1)
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Ready
  )
  const minAmount = 1

  let maxAmount: number
  let currentValue: number
  let playerId: number
  let playerName: string
  let apiEndpoint: string
  let inputLabel: string
  let newBalance: number

  if (isPlayerAsset(player)) {
    currentValue = player.player.currentValue
    maxAmount = player.amount
    playerId = player.player._id
    playerName = player.player.name
    apiEndpoint = '/transaction/sell'
    inputLabel = 'Amount to sell:'
    newBalance = user.portfolio.balance + currentValue * amount
  } else {
    currentValue = player.currentValue
    maxAmount = Math.floor(user.portfolio.balance / currentValue)
    playerId = player._id
    playerName = player.name
    apiEndpoint = '/transaction/buy'
    inputLabel = 'Amount to buy:'
    newBalance = user.portfolio.balance - currentValue * amount
  }

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setAmount(minAmount)
      return
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
        playerId: playerId,
        amount,
      })
      setStatus(TransactionStatus.Success)
      setUser(result.data)
      onComplete && (await onComplete())
    } catch (e) {
      setStatus(TransactionStatus.Error)
    }
  }

  const renderContent = () => {
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
      case TransactionStatus.Error:
        return (
          <>
            <div>Transaction failed. Try again later.</div>
            <div className={styles.widget__footer}>
              <Button text="Go Back" onClick={() => onBack && onBack()} />
            </div>
          </>
        )
      default:
        // user cannot purchase the minimum amount of players
        if (
          !isPlayerAsset(player) &&
          user.portfolio.balance < player.currentValue
        ) {
          return (
            <>
              <div>Insufficient funds.</div>
              <div className={styles.widget__footer}>
                <Button text="Go Back" onClick={() => onBack && onBack()} />
              </div>
            </>
          )
        }
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
              <span>{getValueString(user.portfolio.balance)}</span>
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

  const style = className ? `${styles.widget} ${className}` : styles.widget

  return (
    <div className={style}>
      <div className={styles.widget__header}>{playerName}</div>
      {renderContent()}
    </div>
  )
}

export default PlayerCheckout
