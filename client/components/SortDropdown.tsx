import { useState } from 'react'
import Button, { ButtonSize, ButtonColor } from '@components/Button'
import Dropdown, { DropdownItem } from '@components/Dropdown'

interface SortDropdownItem extends DropdownItem {
  value: SortDropdownProps
}

interface SortDropdownProps {
  sortBy: string
  sortOrder: number
}

const SortDropdown = ({ sortBy, sortOrder }: SortDropdownProps) => {
  const getText = ({ sortBy, sortOrder }: SortDropdownProps): string => {
    let result = ''
    switch (sortBy) {
      case 'name':
        result = 'Name'
        break
      case 'value':
        result = 'Value'
        break
      default:
        return ''
    }
    result += sortOrder === 1 ? ' ↑' : ' ↓'
    return result
  }

  const [buttonText, setButtonText] = useState(
    `Sort by ${getText({ sortBy, sortOrder })}`
  )

  const dropdownItems: SortDropdownItem[] = [
    {
      text: 'Name ↑',
      value: { sortBy: 'name', sortOrder: 1 },
    },
  ]

  return (
    <Dropdown items={dropdownItems}>
      <Button
        text={buttonText}
        style={{ size: ButtonSize.Small, color: ButtonColor.Light }}
      />
    </Dropdown>
  )
}

export default SortDropdown
