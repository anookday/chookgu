import { useEffect, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '@styles/components/Scroll.module.scss'

interface ScrollProps {
  index: number
  next: () => void
  children: JSX.Element[]
}

const Scroll = ({ index, children, next }: ScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (scrollRef.current && index === 0) {
      scrollRef.current.scrollTo(0, 0)
    }
  })

  const renderLoader = () => {
    if (!initialized.current) {
      initialized.current = true
      return <h3>Loading...</h3>
    }
  }

  return (
    <div id="playerContainer" className={styles.container} ref={scrollRef}>
      <InfiniteScroll
        className={styles.scroll}
        dataLength={children.length}
        next={next}
        hasMore={true}
        loader={renderLoader()}
        scrollableTarget="playerContainer"
      >
        {children}
      </InfiniteScroll>
    </div>
  )
}

export default Scroll
