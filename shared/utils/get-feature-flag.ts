import { useRuntimeConfig } from '#imports'

export function getFeatureFlagConfig(): Record<string, boolean> {
  const { featureFlags } = useRuntimeConfig().public

  return asObject(featureFlags)
}
