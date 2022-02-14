import Button from '@components/Button'
import { PlayerAsset } from '@util/Player'
import { Portfolio } from '@util/Portfolio'
import { ChangeEvent, useRef, useState } from 'react'
import styles from '@styles/components/PlayerTransaction.module.scss'
import { formatValue } from '@util/numbers'

interface PlayerSellProps {
  asset: PlayerAsset
  portfolio: Portfolio
  onSell: (
    type: 'buy' | 'sell',
    season: string,
    playerId: number,
    amount: number
  ) => void
}

const PlayerSell = ({ asset, portfolio, onSell }: PlayerSellProps) => {
  const minAmount = 1
  const maxAmount = asset.amount
  const [amount, setAmount] = useState(minAmount)
  const input = useRef<HTMLInputElement>(null)

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

  const newBalance = portfolio.balance + asset.player.currentValue * amount

  return (
    <div className={styles.widget}>
      <div className={styles.amount}>
        <label className={styles.amount__label}>Amount to Sell</label>
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
        <span>{formatValue(asset.player.currentValue * amount)}</span>
      </div>
      <div className={styles.widget__text}>
        Balance after transaction:
        <span className={styles['widget__text--success']}>
          {formatValue(newBalance)}
        </span>
      </div>
      <div className={styles.widget__footer}>
        <Button
          text="Sell"
          size="large"
          onClick={() =>
            onSell('sell', portfolio.season, asset.player._id, amount)
          }
        />
      </div>
    </div>
  )
}

export default PlayerSell
