// Форматування чисел та грошей для UI.

export const formatNumber = (n: number): string => {
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
  return `${Math.round(n)}`
}

export const formatMoney = (n: number): string => {
  const sign = n < 0 ? '-' : ''
  return `${sign}₴${formatNumber(Math.abs(n))}`
}

/** Зі знаком «+» для додатних значень (для змін фанів/грошей за реліз). */
export const formatSigned = (n: number): string => {
  if (n > 0) return `+${formatNumber(n)}`
  if (n < 0) return `-${formatNumber(Math.abs(n))}`
  return '0'
}
