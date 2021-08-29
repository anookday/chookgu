export function getValueString(value: number, compact?: true): string {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: compact ? 'compact' : 'standard',
  }).format(value)
}
