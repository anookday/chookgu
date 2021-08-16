import Layout from './Layout'
import { useGlobal } from '../utils/GlobalContext'
import styles from '../styles/components/Dashboard.module.scss'

const Dashboard = () => {
  const { user } = useGlobal()
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.app}>
          <h1>{user?.username}</h1>
          <h2>{user?.email}</h2>
          <h2>{user?.balance}</h2>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
