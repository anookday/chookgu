import {
  useState,
  Dispatch,
  SetStateAction,
  MouseEvent,
  ChangeEvent,
  useRef,
} from 'react'
import Button from '@components/Button'
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
  player: Player | PlayerAsset
  portfolio: Portfolio
  className?: string
  onComplete?: (portfolio: Portfolio) => void
  onCancel?: () => void
}

/**
 * Return true if user does not have enough funds to buy the selected player.
 */
const userHasInsufficientFunds = (props: PlayerCheckoutProps) => {
  // if user is selling players then there is no need to check their balance
  if (isPlayerAsset(props.player)) {
    return false
  }

  return props.portfolio.balance < props.player.currentValue
}

/**
 * Renders widget content based on transaction status.
 */
const Content = (props: PlayerCheckoutProps) => {
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Ready
  )
  const onCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.onCancel && props.onCancel()
  }

  switch (status) {
    // transaction is processing
    case TransactionStatus.Processing:
      return (
        <>
          <div>Processing...</div>
          <div className={styles.widget__footer}></div>
        </>
      )
    // transaction succeeded
    case TransactionStatus.Success:
      return (
        <>
          <div>Success!</div>
          <div className={styles.widget__footer}>
            <Button text="Proceed" onClick={onCancel} />
          </div>
        </>
      )
    // transaction failed
    case TransactionStatus.Failed:
      return (
        <>
          <div>Transaction failed. Try again later.</div>
          <div className={styles.widget__footer}>
            <Button text="Go Back" onClick={onCancel} />
          </div>
        </>
      )
    // transaction is ready to be processed
    default:
      return (
        <TransactionContent
          checkout={props}
          setStatus={setStatus}
          onCancel={onCancel}
        />
      )
  }
}

interface TransactionProps {
  checkout: PlayerCheckoutProps
  setStatus: Dispatch<SetStateAction<TransactionStatus>>
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void
}

/**
 * Returns widget content while in ready state.
 */
const TransactionContent = ({
  checkout,
  setStatus,
  onCancel,
}: TransactionProps) => {
  const [amount, setAmount] = useState(1)
  const input = useRef<HTMLInputElement>(null)
  // user does not have enough funds to buy the selected player
  if (userHasInsufficientFunds(checkout)) {
    return (
      <>
        <div>Insufficient funds.</div>
        <div className={styles.widget__footer}>
          <Button text="Go Back" onClick={onCancel} />
        </div>
      </>
    )
  }

  const minAmount = 1

  // variables that depend on whether the user is buying or selling players
  let currentPlayer: Player
  let maxAmount: number
  let apiEndpoint: string
  let inputLabel: string
  let newBalance: number
  if (isPlayerAsset(checkout.player)) {
    currentPlayer = checkout.player.player
    maxAmount = checkout.player.amount
    apiEndpoint = '/portfolio/sell'
    inputLabel = 'Amount to sell:'
    newBalance =
      checkout.portfolio.balance + currentPlayer.currentValue * amount
  } else {
    currentPlayer = checkout.player
    maxAmount = Math.floor(
      checkout.portfolio.balance / currentPlayer.currentValue
    )
    apiEndpoint = '/portfolio/buy'
    inputLabel = 'Amount to buy:'
    newBalance =
      checkout.portfolio.balance - currentPlayer.currentValue * amount
  }

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

  // confirm click event handler
  const onConfirm = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setStatus(TransactionStatus.Processing)
    try {
      const result = await api.post<Portfolio>(apiEndpoint, {
        season: checkout.portfolio.season,
        playerId: currentPlayer._id,
        amount,
      })
      setStatus(TransactionStatus.Success)
      checkout.onComplete && checkout.onComplete(result.data)
    } catch (err) {
      console.error(err.response)
      setStatus(TransactionStatus.Failed)
    }
  }

  return (
    <>
      <div className={styles.amount}>
        <label className={styles.amount__label}>{inputLabel}</label>
        <div className={styles.amount__input}>
          <button onClick={() => input.current?.stepDown()}>{`<`}</button>
          <input
            ref={input}
            type="number"
            value={amount}
            min={minAmount}
            max={maxAmount}
            onChange={onAmountChange}
            onFocus={(event) => event.target.select()}
          />
          <button onClick={() => input.current?.stepUp()}>{`>`}</button>
        </div>
      </div>
      <div className={styles.widget__text}>
        Current balance:
        <span>{formatValue(checkout.portfolio.balance)}</span>
      </div>
      <div className={styles.widget__text}>
        Price:
        <span>{formatValue(currentPlayer.currentValue * amount)}</span>
      </div>
      <div className={styles.widget__text}>
        Balance after transaction:
        <span>{formatValue(newBalance)}</span>
      </div>
      <div className={styles.widget__footer}>
        <Button text="Go Back" color="light" onClick={onCancel} />
        <Button text="Confirm" onClick={onConfirm} />
      </div>
    </>
  )
}

/**
 * Player checkout component
 */
const PlayerCheckout = (props: PlayerCheckoutProps) => {
  const style = props.className
    ? `${styles.widget} ${props.className}`
    : styles.widget

  const playerName = isPlayerAsset(props.player)
    ? props.player.player.name
    : props.player.name

  return (
    <div className={style}>
      <div className={styles.widget__header}>{playerName}</div>
      <Content {...props} />
    </div>
  )
}

export default PlayerCheckout
