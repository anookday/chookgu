import { useState, useEffect, useRef } from 'react'
import styles from '@styles/components/Search.module.scss'

interface SearchProps {
  onChange: (searchTerm: string) => void
}

const Search = ({ onChange }: SearchProps) => {
  const initialized = useRef(false)
  const [term, setTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState(term)

  // wait until user stops inputting for 1 second, then search
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term)
    }, 500)

    return () => {
      clearTimeout(timerId)
    }
  }, [term])

  // this is where the search happens
  useEffect(() => {
    // don't search if the component has not rendered yet
    if (!initialized.current) {
      initialized.current = true
      return
    }

    onChange(debouncedTerm)
  }, [debouncedTerm])

  return (
    <div className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search for players"
        className={styles.input}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  )
}

export default Search
