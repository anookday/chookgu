import { useState } from 'react'
import Button from '@components/Button'
import { usePortfolio } from '@context/PortfolioContext'
import styles from '@styles/components/PlayerCheckout.module.scss'
import api from '@util/api'
import { formatValue } from '@util/numbers'
import { Player, PlayerAsset, isPlayerAsset } from '@util/Player'
import { Portfolio } from '@util/Portfolio'

enum TransactionStatus {
  Ready,
  Processing,
  Success,
  Failed,
}

interface PlayerCheckoutProps {
  className?: string
  player: Player | PlayerAsset
  // function to call whenever user navigates away from checkout component
  onBack?: () => void
}

const PlayerCheckout = ({ className, player, onBack }: PlayerCheckoutProps) => {
  const [portfolio, setPortfolio] = usePortfolio()
  const [amount, setAmount] = useState(1)
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Ready
  )

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
      const result = await api.post<Portfolio>(apiEndpoint, {
        season: portfolio.season,
        playerId: playerId,
        amount,
      })
      setStatus(TransactionStatus.Success)
      setPortfolio(result.data)
    } catch (err) {
      console.error(err.response)
      setStatus(TransactionStatus.Failed)
    }
  }

  const renderContent = () => {
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
              <span>{formatValue(portfolio.balance)}</span>
            </div>
            <div className={styles.widget__text}>
              <span>Price:</span>
              <span>{formatValue(currentValue * amount)}</span>
            </div>
            <div className={styles.widget__text}>
              <span>Balance after transaction:</span>
              <span>{formatValue(newBalance)}</span>
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
