import { useRouter } from 'next/router'
import Dropdown from '@components/Dropdown'
import picture from '@public/profile.jpg'
import { useGlobal } from '@utils/GlobalContext'
import api from '@utils/api'
import styles from '@styles/components/UserMenu.module.scss'

const UserMenu = () => {
  const { user } = useGlobal()
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

  return (
    <Dropdown
      items={[{ text: 'Settings' }, { text: 'Log Out', onClick: logout }]}
    >
      <div className={styles.user}>
        <span className={styles.user_name}>{user.username}</span>
        <img src={picture.src} className={styles.user_photo} alt="user photo" />
      </div>
    </Dropdown>
  )
}

export default UserMenu
