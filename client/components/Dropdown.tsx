import { useState, useEffect, useRef } from 'react'
import styles from '@styles/components/Dropdown.module.scss'

export interface DropdownItem {
  text: string
  selected?: true
  onClick?: () => void
}

export interface DropdownProps {
  children: JSX.Element
  items: DropdownItem[]
}

const Dropdown = ({ children, items }: DropdownProps) => {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.addEventListener('click', onOutsideClick, true)
    return () => {
      document.removeEventListener('click', onOutsideClick, true)
    }
  }, [])

  const onOutsideClick = (event: MouseEvent) => {
    const el = event.target
    if (ref.current && !(el instanceof Node && ref.current.contains(el))) {
      setVisible(false)
    }
  }

  const onItemClick = (onClick: (() => void) | undefined) => {
    onClick && onClick()
    setVisible(false)
  }

  const renderItems = () => {
    return items.map(({ text, selected, onClick }) => (
      <div
        key={text}
        className={`${styles.dropdown__list__item}\
          ${selected ? ` ${styles['dropdown__list__item--selected']}` : ''}`}
        onClick={() => onItemClick(onClick)}
      >
        <span>{text}</span>
      </div>
    ))
  }

  return (
    <div className={styles.dropdown} ref={ref}>
      <div
        className={styles.dropdown__input}
        onClick={() => setVisible(!visible)}
      >
        {children}
      </div>
      <div
        className={`${styles.dropdown__list}\
          ${visible ? ` ${styles['dropdown__list--visible']}` : ''}`}
      >
        {renderItems()}
      </div>
    </div>
  )
}

export default Dropdown
