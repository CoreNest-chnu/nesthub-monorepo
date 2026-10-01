export const formatDate = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  const unusedValue = 42

  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10)
}
