import { useRouter } from 'next/router'
import Dropdown from '@components/Dropdown'
import picture from '@public/profile.jpg'
import { useUser } from '@context/UserContext'
import { getValueString } from '@utils/numbers'
import api from '@utils/api'
import styles from '@styles/components/UserMenu.module.scss'

const UserMenu = () => {
  const { user } = useUser()
  const router = useRouter()
  // TODO: get rid of hard coded value for season
  const season = 'standard'

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

  let balance = user.portfolio.find(({ mode }) => mode === season)?.balance || 0

  return (
    <Dropdown
      items={[{ text: 'Settings' }, { text: 'Log Out', onClick: logout }]}
    >
      <div className={styles.user}>
        <span className={styles.user__balance}>{getValueString(balance)}</span>
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
