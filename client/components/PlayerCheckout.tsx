import {
  useState,
  Dispatch,
  SetStateAction,
  MouseEvent,
  ChangeEvent,
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
const renderContent = (
  props: PlayerCheckoutProps,
  amount: number,
  setAmount: Dispatch<SetStateAction<number>>,
  status: TransactionStatus,
  setStatus: Dispatch<SetStateAction<TransactionStatus>>
) => {
  const onCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    props.onCancel && props.onCancel()
  }

  // user does not have enough funds to buy the selected player
  if (userHasInsufficientFunds(props)) {
    return (
      <>
        <div>Insufficient funds.</div>
        <div className={styles.widget__footer}>
          <Button text="Go Back" onClick={onCancel} />
        </div>
      </>
    )
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
      return renderTransactionReadyContent(
        props,
        amount,
        setAmount,
        setStatus,
        onCancel
      )
  }
}

/**
 * Returns widget content while in ready state.
 */
const renderTransactionReadyContent = (
  props: PlayerCheckoutProps,
  amount: number,
  setAmount: Dispatch<SetStateAction<number>>,
  setStatus: Dispatch<SetStateAction<TransactionStatus>>,
  onCancel: (e: MouseEvent<HTMLButtonElement>) => void
) => {
  const minAmount = 1

  // variables that depend on whether the user is buying or selling players
  let currentPlayer: Player
  let maxAmount: number
  let apiEndpoint: string
  let inputLabel: string
  let newBalance: number
  if (isPlayerAsset(props.player)) {
    currentPlayer = props.player.player
    maxAmount = props.player.amount
    apiEndpoint = '/portfolio/sell'
    inputLabel = 'Amount to sell:'
    newBalance = props.portfolio.balance + currentPlayer.currentValue * amount
  } else {
    currentPlayer = props.player
    maxAmount = Math.floor(props.portfolio.balance / currentPlayer.currentValue)
    apiEndpoint = '/portfolio/buy'
    inputLabel = 'Amount to buy:'
    newBalance = props.portfolio.balance - currentPlayer.currentValue * amount
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
        season: props.portfolio.season,
        playerId: currentPlayer._id,
        amount,
      })
      setStatus(TransactionStatus.Success)
      props.onComplete && props.onComplete(result.data)
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
        <span>{formatValue(props.portfolio.balance)}</span>
      </div>
      <div className={styles.widget__text}>
        <span>Price:</span>
        <span>{formatValue(currentPlayer.currentValue * amount)}</span>
      </div>
      <div className={styles.widget__text}>
        <span>Balance after transaction:</span>
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
  const [amount, setAmount] = useState(1)
  const [status, setStatus] = useState<TransactionStatus>(
    TransactionStatus.Ready
  )
  const style = props.className
    ? `${styles.widget} ${props.className}`
    : styles.widget

  const playerName = isPlayerAsset(props.player)
    ? props.player.player.name
    : props.player.name

  return (
    <div className={style}>
      <div className={styles.widget__header}>{playerName}</div>
      {renderContent(props, amount, setAmount, status, setStatus)}
    </div>
  )
}

export default PlayerCheckout
