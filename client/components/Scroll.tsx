import InfiniteScroll from 'react-infinite-scroll-component'
import styles from '@styles/components/Scroll.module.scss'

interface ScrollProps {
  next: () => void
  children: JSX.Element[]
}

const Scroll = ({ children, next }: ScrollProps) => {
  return (
    <div id="playerContainer" className={styles.container}>
      <InfiniteScroll
        className={styles.scroll}
        dataLength={children.length}
        next={next}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        scrollableTarget="playerContainer"
      >
        {children}
      </InfiniteScroll>
    </div>
  )
}

export default Scroll
