export function useUserPlatform() {
  const DEFAULT_PLATFORM = 'windows'

  // Get platform from user agent
  const { platform } = asObject(navigator?.userAgentData)

  // Return if macOS or iOS
  if (platform === 'macOS' || platform === 'iOS') {
    return 'apple'
  }

  // Or return default
  return DEFAULT_PLATFORM
}