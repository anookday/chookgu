import styles from '@styles/components/Landing.module.scss'

const Landing = () => {
  return (
    <>
      <section id="overview" className={`${styles.section} ${styles.overview}`}>
        Overview
      </section>
      <section
        id="tournaments"
        className={`${styles.section} ${styles.tournaments}`}
      >
        Tournaments
      </section>
      <section id="prizes" className={`${styles.section} ${styles.prizes}`}>
        Prizes
      </section>
      <section id="contact" className={`${styles.section} ${styles.contact}`}>
        Contact
      </section>
    </>
  )
}

export default Landing
