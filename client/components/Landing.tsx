import Image from 'next/image'
import Link from 'next/link'
import Button from '@components/Button'
import Dashboard from '@public/demo-1.png'
import Portfolio from '@public/demo-2.png'
import Trade from '@public/demo-3.png'
import Transaction from '@public/demo-4.png'
import Medals from '@public/medals.png'
import styles from '@styles/components/Landing.module.scss'

const Landing = () => {
  return (
    <>
      <section id="main" className={`${styles.section} ${styles.main}`}>
        <div className={styles.main__content}>
          <div className={styles.main__description}>
            <h1 className={styles.main__description__text}>
              Trade your favorite{' '}
              <em className={styles['text--complement']}>soccer players</em> in
              a{' '}
              <em className={styles['text--accent']}>
                real-time simulated fantasy stock market
              </em>
            </h1>
          </div>
          <div className={`${styles.main__image} ${styles.image}`}>
            <div className={styles.image__dashboard}>
              <Image
                src={Dashboard.src}
                alt="Photo of user dashboard in app"
                className={styles.image__img}
                layout="fill"
              />
            </div>
          </div>
        </div>
        <div className={styles.main__link}>
          <Link href="/account/register" passHref>
            <Button text="Get Started" size="large" />
          </Link>
        </div>
      </section>
      <section id="trade" className={`${styles.section} ${styles.trade}`}>
        <div className={styles.trade__description}>
          <h2 className={styles.trade__description__text}>
            Buy and sell top talent with in-game currency. Watch as your smart
            investments rake in profits in real-time.
          </h2>
        </div>
        <div className={`${styles.trade__image} ${styles.image}`}>
          <div className={styles.image__trade}>
            <Image
              src={Trade.src}
              alt="Photo of trading players in app"
              className={styles.image__img}
              layout="fill"
            />
          </div>
          <div className={styles.image__portfolio}>
            <Image
              src={Portfolio.src}
              alt="Photo of user portfolio in app"
              className={styles.image__img}
              layout="fill"
            />
          </div>
          <div className={styles.image__transaction}>
            <Image
              src={Transaction.src}
              alt="Photo of player transaction in app"
              className={styles.image__img}
              layout="fill"
            />
          </div>
        </div>
      </section>
      <section id="compete" className={`${styles.section} ${styles.compete}`}>
        <div className={styles.compete__image}>
          <Image
            src={Medals.src}
            alt="Photo of medals"
            className={styles.image__img}
            width="621"
            height="640"
          />
        </div>
        <div className={styles.compete__description}>
          <h2 className={styles.compete__desription__text}>
            Compete against other players around the world. Show off your soccer
            IQ and trading abilities on the global leaderboards.
          </h2>
        </div>
      </section>
      <section id="contact" className={`${styles.section} ${styles.contact}`}>
        <div className={styles.contact__content}>
          <h2 className={styles.contact__text}>
            Questions? Something on your mind? Feel free to let the developer
            know.
          </h2>
          <h3>
            Developer: <em className={styles['text--accent']}>Freddy Shim</em>
          </h3>
          <h3>
            Email:{' '}
            <em className={styles['text--accent']}>shimfreddy@gmail.com</em>
          </h3>
        </div>
      </section>
    </>
  )
}

export default Landing
