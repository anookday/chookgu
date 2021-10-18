import { useRouter } from 'next/router'
import Dropdown, { DropdownItem } from '@components/Dropdown'
import picture from '@public/profile.jpg'
import { useUser } from '@context/UserContext'
import { usePortfolio } from '@context/PortfolioContext'
import { formatValue } from '@util/numbers'
import api from '@util/api'
import styles from '@styles/components/UserMenu.module.scss'

const UserMenu = () => {
  const [user] = useUser()
  const [portfolio] = usePortfolio()
  const router = useRouter()

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Already logged out.')
      } else {
        console.log('Unknown error occurred.')
      }
    } finally {
      router.push('/')
    }
  }

  let options: DropdownItem[] = [
    { text: 'Settings', onClick: () => router.push('/account') },
    { text: 'Log Out', onClick: () => logout() },
  ]

  if (user.auth === 'admin') {
    options.splice(1, 0, {
      text: 'Admin',
    })
  }

  return (
    <Dropdown items={options}>
      <div className={styles.user}>
        <span className={styles.user__balance}>
          {formatValue(portfolio.balance)}
        </span>
        <span className={styles.user__name}>{user.username}</span>
        <img
          src={picture.src}
          className={styles.user__photo}
          alt="user photo"
        />
      </div>
    </Dropdown>
  )
}

export default UserMenu
