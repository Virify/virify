import { useRuntimeConfig } from '#imports'

export function getFeatureFlagConfig() {
  const { featureFlags } = useRuntimeConfig().public

  return featureFlags
}
