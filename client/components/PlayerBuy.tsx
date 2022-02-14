import Button from '@components/Button'
import { Player } from '@util/Player'
import { Portfolio } from '@util/Portfolio'
import { ChangeEvent, useRef, useState } from 'react'
import styles from '@styles/components/PlayerTransaction.module.scss'
import { formatValue } from '@util/numbers'

interface PlayerBuyProps {
  player: Player
  portfolio: Portfolio
  onBuy: (
    type: 'buy' | 'sell',
    season: string,
    playerId: number,
    amount: number
  ) => void
}

const PlayerBuy = ({ player, portfolio, onBuy }: PlayerBuyProps) => {
  const minAmount = 1
  const maxAmount = Math.floor(portfolio.balance / player.currentValue)
  const [amount, setAmount] = useState(minAmount)
  const input = useRef<HTMLInputElement>(null)

  if (portfolio.balance < player.currentValue) {
    return (
      <div className={styles.widget}>
        <div className={styles.widget__header}>Insufficient funds.</div>
      </div>
    )
  }

  const newBalance = portfolio.balance - player.currentValue * amount

  // input value change event handler
  const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const onAmountChangeByArrows = (newAmount: number) => {
    if (newAmount < minAmount || newAmount > maxAmount) return
    setAmount(newAmount)
  }

  return (
    <div className={styles.widget}>
      <div className={styles.amount}>
        <label className={styles.amount__label}>Amount to Buy</label>
        <div className={styles.amount__input}>
          <button
            onClick={() => onAmountChangeByArrows(amount - 1)}
          >{`<`}</button>
          <input
            ref={input}
            type="number"
            value={amount}
            min={minAmount}
            max={maxAmount}
            onChange={onAmountChange}
            onFocus={(event) => event.target.select()}
          />
          <button
            onClick={() => onAmountChangeByArrows(amount + 1)}
          >{`>`}</button>
        </div>
      </div>
      <div className={styles.widget__text}>
        Current balance:
        <span>{formatValue(portfolio.balance)}</span>
      </div>
      <div className={styles.widget__text}>
        Price:
        <span className={styles['widget__text--error']}>
          {formatValue(player.currentValue * amount)}
        </span>
      </div>
      <div className={styles.widget__text}>
        Balance after transaction:
        <span className={styles['widget__text--success']}>
          {formatValue(newBalance)}
        </span>
      </div>
      <div className={styles.widget__footer}>
        <Button
          text="Buy"
          size="large"
          onClick={() => onBuy('buy', portfolio.season, player._id, amount)}
        />
      </div>
    </div>
  )
}

export default PlayerBuy
