import { useState } from 'react'
import { useRouter } from 'next/router'
import { useGlobal } from '@utils/GlobalContext'
import api from '@utils/api'
import picture from '@public/profile.jpg'
import styles from '@styles/components/UserMenu.module.scss'

const AccountDropdown = () => {
  const { user } = useGlobal()
  const [selected, setSelected] = useState(false)
  const router = useRouter()

  const toggleSelected = () => {
    setSelected(!selected)
  }

  const logout = async (event: React.MouseEvent) => {
    event.preventDefault()
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
    <div
      className={`${styles.user}${selected ? ` ${styles.selected}` : ''}`}
      onClick={toggleSelected}
    >
      <span className={styles.user_name}>{user.username}</span>
      <img src={picture.src} className={styles.user_photo} alt="user photo" />
      <div className={styles.user_dropdown}>
        <div className={styles.user_dropdown__item}>
          <span>Settings</span>
        </div>
        <div className={styles.user_dropdown__item} onClick={logout}>
          <span>Log Out</span>
        </div>
      </div>
    </div>
  )
}

export default AccountDropdown
