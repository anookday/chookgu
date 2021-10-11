export function formatValue(
  value: number,
  compact: boolean = false,
  showSign: boolean = false
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

export function formatPercent(
  value: number,
  showSign: boolean = false
): string {
  return value.toLocaleString('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    signDisplay: showSign ? 'always' : 'auto',
  })
}

export function formatMargin(
  previous: number,
  current: number,
  amount: number = 1,
  compact: boolean = false
) {
  return formatValue((current - previous) * amount, compact, true)
}

export function formatMarginPercent(previous: number, current: number) {
  return formatPercent((current - previous) / previous, true)
}
