export function getValueString(
  value: number,
  compact?: true,
  showSign?: true
): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: compact ? 'compact' : 'standard',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    signDisplay: showSign ? 'always' : 'auto',
  })
}

export function getPercent(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function getMarginString(
  previous: number,
  current: number,
  amount: number
) {
  const margin = (current - previous) * amount
  const percent = (current - previous) / previous

  return `${getValueString(margin, true, true)} (${getPercent(percent)})`
}
