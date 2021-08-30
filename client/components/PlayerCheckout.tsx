import { useState } from 'react'
import Button, { ButtonColor } from '@components/Button'
import api from '@utils/api'
import { getValueString } from '@utils/Currency'
import { Player } from '@utils/Player'
import { DatabaseUser } from '@utils/User'
import { useUser } from '@context/UserContext'
import styles from '@styles/components/PlayerCheckout.module.scss'

enum TransactionStatus {
  Ready,
  Processing,
  Success,
  Error,
}

interface PlayerCheckoutProps {
  player: Player
  onBack: () => void
  onComplete: () => void
}

const PlayerCheckout = ({
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

  const getTotalPrice = () => {
    return player.currentValue * amount
  }

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      setAmount(minAmount)
      return
    }

    let newAmount = parseInt(event.target.value)

    if (!newAmount || newAmount < minAmount) return

    if (newAmount * player.currentValue > user.portfolio.balance) {
      newAmount = Math.floor(user.portfolio.balance / player.currentValue)
    }

    setAmount(newAmount)
  }

  const sendTransaction = async () => {
    setStatus(TransactionStatus.Processing)
    try {
      const result = await api.post<DatabaseUser>('/transaction/buy', {
        playerId: player._id,
        amount,
      })
      setStatus(TransactionStatus.Success)
      const { _id, __v, ...user } = result.data
      setUser(user)
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
            <div className={styles.widget_footer}></div>
          </>
        )
      case TransactionStatus.Success:
        return (
          <>
            <div>Success!</div>
            <div className={styles.widget_footer}>
              <Button text="Proceed" onClick={() => onComplete()} />
            </div>
          </>
        )
      case TransactionStatus.Error:
        return (
          <>
            <div>Transaction failed. Try again later.</div>
            <div className={styles.widget_footer}>
              <Button
                text="Go Back"
                onClick={() => setStatus(TransactionStatus.Processing)}
              />
            </div>
          </>
        )
      default:
        // user cannot purchase the minimum amount of players
        if (user.portfolio.balance < player.currentValue) {
          return (
            <>
              <div>Insufficient funds.</div>
              <div className={styles.widget_footer}>
                <Button text="Go Back" onClick={() => onBack()} />
              </div>
            </>
          )
        }
        return (
          <>
            <div className={styles.amount}>
              <label className={styles.amount_label}>Amount to buy:</label>
              <div className={styles.amount_input}>
                <input
                  type="number"
                  value={amount}
                  min={minAmount}
                  onChange={onAmountChange}
                  onFocus={(event) => event.target.select()}
                />
              </div>
            </div>
            <div className={styles.widget_text}>
              <span>Current balance:</span>
              <span>{getValueString(user.portfolio.balance)}</span>
            </div>
            <div className={styles.widget_text}>
              <span>Price:</span>
              <span>{getValueString(getTotalPrice())}</span>
            </div>
            <div className={styles.widget_text}>
              <span>Balance after transaction:</span>
              <span>
                {getValueString(user.portfolio.balance - getTotalPrice())}
              </span>
            </div>
            <div className={styles.widget_footer}>
              <Button
                text="Go Back"
                color={ButtonColor.Light}
                onClick={() => onBack()}
              />
              <Button text="Confirm" onClick={() => sendTransaction()} />
            </div>
          </>
        )
    }
  }

  return (
    <div className={styles.widget}>
      <div className={styles.widget_header}>{player.name}</div>
      {renderContent()}
    </div>
  )
}

export default PlayerCheckout
