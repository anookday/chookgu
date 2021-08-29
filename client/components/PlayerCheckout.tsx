import Button, { ButtonColor } from '@components/Button'
import { getValueString } from '@utils/Currency'
import { Player } from '@utils/Player'
import { useGlobal } from '@utils/GlobalContext'
import styles from '@styles/components/PlayerCheckout.module.scss'

interface PlayerCheckoutProps {
  player: Player
  onBackButtonClick: () => void
}

const PlayerCheckout = ({ player, onBackButtonClick }: PlayerCheckoutProps) => {
  const { user } = useGlobal()

  const renderContent = () => {
    if (user.portfolio.balance < player.currentValue) {
      return (
        <>
          <div>Insufficient funds.</div>
          <div className={styles.widget_footer}>
            <Button text="Go Back" onClick={() => onBackButtonClick()} />
          </div>
        </>
      )
    }

    return (
      <>
        <div>Current balance: {getValueString(user.portfolio.balance)}</div>
        <div>Price: {getValueString(player.currentValue)}</div>
        <div>
          Balance after transaction:{' '}
          {getValueString(user.portfolio.balance - player.currentValue)}
        </div>
        <div className={styles.widget_footer}>
          <Button
            text="Go Back"
            color={ButtonColor.Light}
            onClick={() => onBackButtonClick()}
          />
          <Button text="Confirm" />
        </div>
      </>
    )
  }

  return (
    <div className={styles.widget}>
      <div className={styles.widget_header}>{player.name}</div>
      {renderContent()}
    </div>
  )
}

export default PlayerCheckout
