export const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url) return false

  try {
    new URL(url)

    return true
  } catch {
    return false
  }
}
