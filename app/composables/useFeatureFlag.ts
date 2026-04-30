export function useFeatureFlag() {
  const flags = getFeatureFlagConfig()
  const { role, roleActive } = useRole()

  return {
    ...flags,
    role,
    roleActive
  }
}