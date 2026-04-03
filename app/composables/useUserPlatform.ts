/**
 *  @TODO
 *  The `userAgentData` property is experimental and not yet widely
 *  supported, including by TypeScript. It's current only supported
 *  in Chrome and Chromium-based browsers (Edge, Opera, etc.) but not
 *  in Safari or Firefox. To avoid linting errors, we are casting this
 *  ourselves here, but should remove this interface if/when support
 *  becomes more wide-spread
 */
interface N extends Navigator {
  userAgentData: Record<string, string>
}

export function useUserPlatform() {
  const DEFAULT_PLATFORM = 'windows'

  // Get platform from user agent
  const { platform } = asObject((navigator as N)?.userAgentData)

  // Return if macOS or iOS
  if (platform === 'macOS' || platform === 'iOS') {
    return 'apple'
  }

  // Or return default
  return DEFAULT_PLATFORM
}