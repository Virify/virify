import { useRuntimeConfig } from '#imports'

interface FeatureFlagConfig {
  enableSearch: boolean
  enableListing: boolean
}

export function getFeatureFlagConfig(): FeatureFlagConfig {
  const config = useRuntimeConfig().public

  return {
    enableSearch: config.ENABLE_SEARCH === 'true',
    enableListing: config.ENABLE_LISTING === 'true',
  }
}
