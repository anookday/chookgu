import { useState, useEffect, useRef } from 'react'
import Button from '@components/Button'
import styles from '@styles/components/Form.module.scss'

interface EditFieldProps {
  type: string
  label: string
  value: string
  description: string
  validate: (val: string) => boolean
  onSave: (val: string) => Promise<void>
}

enum SaveState {
  Default,
  Processing,
  Success,
  Fail,
}

const EditField = ({
  type,
  label,
  value,
  description,
  validate,
  onSave,
}: EditFieldProps) => {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)
  const [state, setState] = useState<SaveState>(SaveState.Default)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) {
      ref.current?.focus()
    }
  }, [editing])

  const edit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (type === 'password') {
      setText('')
    }
    setEditing(true)
    setState(SaveState.Default)
  }

  const cancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setText(value)
    setEditing(false)
  }

  const save = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setState(SaveState.Processing)
    try {
      await onSave(text)
      setState(SaveState.Success)
    } catch (error) {
      setState(SaveState.Fail)
    }
    setEditing(false)
  }

  const renderMessage = () => {
    switch (state) {
      case SaveState.Processing:
        return 'Saving changes...'
      case SaveState.Success:
        return 'Your profile changes have been saved.'
      case SaveState.Fail:
        return 'Unable to save changes.'
      default:
        return description
    }
  }

  let buttons = <Button text="Edit" size="small" color="light" onClick={edit} />
  if (editing) {
    buttons = (
      <>
        <Button
          text="Save"
          size="small"
          onClick={save}
          disabled={!validate(text)}
        />
        <Button text="Cancel" size="small" color="warning" onClick={cancel} />
      </>
    )
  }

  let descStyle = styles.field__description
  if (!validate(text) || state === SaveState.Fail) {
    descStyle += ' ' + styles['field__description--warning']
  }
  if (state !== SaveState.Default) {
    descStyle += ' ' + styles['field__description--show']
  }

  return (
    <label className={styles.field}>
      <span className={styles.field__title}>{label}</span>
      <div className={styles.field__row}>
        <div className={styles.field__content}>
          <input
            ref={ref}
            className={styles.field__input}
            type={type}
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            disabled={!editing}
          />
          <p className={descStyle}>{renderMessage()}</p>
        </div>
        {buttons}
      </div>
    </label>
  )
}

export default EditField
