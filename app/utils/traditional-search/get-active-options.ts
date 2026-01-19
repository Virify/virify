export function getActiveOptions(options: Record<string, unknown>) {
  const optionsArray = Object.entries(options)

  return optionsArray.filter(([_, value]) => !!value).flatMap(([key]) => key)
}