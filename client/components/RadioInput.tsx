import styles from '@styles/components/RadioInput.module.scss'

export interface RadioInputValue {
  name: string
  value: string
}

export interface RadioInputProps {
  className?: string
  values: RadioInputValue[]
  selected: string
  onChange: (value: string) => void
}

const RadioInput = ({
  className,
  values,
  selected,
  onChange,
}: RadioInputProps) => {
  let style = styles.container
  if (className) style += ' ' + className

  return (
    <div className={style}>
      {values.map((value) => (
        <div key={value.value}>
          <label className={styles.radioField}>
            <input
              className={styles.radioField__input}
              type="radio"
              value={value.value}
              checked={selected === value.value}
              onChange={(event) => onChange(event.target.value)}
            />
            <span className={styles.radioField__title}>{value.name}</span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default RadioInput
