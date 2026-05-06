import { useRuntimeConfig } from '#imports'

export function getFeatureFlagConfig() {
  const { featureFlags } = useRuntimeConfig().public

  return featureFlags
}

export function checkFeatureFlag(flag: string) {
  const flags = getFeatureFlagConfig()

  return !!flags[flag as keyof typeof flags]
}
