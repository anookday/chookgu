import styles from '@styles/components/Landing.module.scss'

const Landing = () => {
  return (
    <>
      <div id="overview" className={styles.container_overview}>
        Overview
      </div>
      <div id="tournaments" className={styles.container_tournaments}>
        Tournaments
      </div>
      <div id="prizes" className={styles.container_prizes}>
        Prizes
      </div>
      <div id="contact" className={styles.container_contact}>
        Contact
      </div>
    </>
  )
}

export default Landing
