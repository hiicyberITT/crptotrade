export function formatCurrency(n: number | string, currency = 'USD') {
  const num = typeof n === 'string' ? Number(n) : n
  if (!Number.isFinite(num)) return '$0.00'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(num)
}

export function formatCompactCurrency(n: number | string) {
  const num = typeof n === 'string' ? Number(n) : n
  if (!Number.isFinite(num)) return '$0'
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2, style: 'currency', currency: 'USD' }).format(num)
}
