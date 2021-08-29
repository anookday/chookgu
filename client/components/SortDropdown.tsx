import Button, { ButtonSize, ButtonColor } from '@components/Button'
import Dropdown, { DropdownItem } from '@components/Dropdown'

export enum SortBy {
  Name = 'name',
  Value = 'currentValue',
}

export enum SortOrder {
  Asc = 1,
  Desc = -1,
}

interface SortDropdownProps {
  sortBy: SortBy
  sortOrder: SortOrder
  onSelected: (sortBy: SortBy, sortOrder: SortOrder) => void
}

interface SortDropdownItem {
  sortBy: SortBy
  sortOrder: SortOrder
  selected?: true
}

const SortDropdown = ({ sortBy, sortOrder, onSelected }: SortDropdownProps) => {
  /**
   * Return the text representative of sort options.
   */
  const getItemText = (sortBy: SortBy, sortOrder: SortOrder): string => {
    if (sortBy === SortBy.Name) {
      if (sortOrder === SortOrder.Asc) {
        return 'Name (A to Z)'
      }
      return 'Name (Z to A)'
    }
    if (sortOrder === SortOrder.Asc) {
      return 'Value (Low to High)'
    }
    return 'Value (High to Low)'
  }

  /**
   * Return the text displayed by the dropdown button.
   */
  const getButtonText = () => {
    return `Sort by ${getItemText(sortBy, sortOrder)}`
  }

  const items: SortDropdownItem[] = [
    { sortBy: SortBy.Name, sortOrder: SortOrder.Asc },
    { sortBy: SortBy.Name, sortOrder: SortOrder.Desc },
    { sortBy: SortBy.Value, sortOrder: SortOrder.Asc },
    { sortBy: SortBy.Value, sortOrder: SortOrder.Desc },
  ]

  for (let i = 0; i < items.length; i++) {
    if (items[i].sortBy === sortBy && items[i].sortOrder === sortOrder) {
      items[i].selected = true
      break
    }
  }

  const dropdownItems: DropdownItem[] = items.map((item) => {
    return {
      text: getItemText(item.sortBy, item.sortOrder),
      selected: item.selected,
      onClick: () => onSelected(item.sortBy, item.sortOrder),
    }
  })

  return (
    <Dropdown items={dropdownItems}>
      <Button
        text={getButtonText()}
        size={ButtonSize.Small}
        color={ButtonColor.Light}
      />
    </Dropdown>
  )
}

export default SortDropdown
