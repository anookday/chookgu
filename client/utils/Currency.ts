export function getValueString(value: number, compact?: true): string {
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: compact ? 'compact' : 'standard',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
