import styles from '../styles/components/AppContent.module.scss'
import { useGlobal } from '../utils/GlobalContext'

const AppContent = () => {
  const { user } = useGlobal()
  return (
    <div className={styles.container}>
      <div className={styles.app}>
        <h1>{user?.username}</h1>
        <h2>{user?.email}</h2>
        <h2>{user?.balance}</h2>
      </div>
    </div>
  )
}

export default AppContent
