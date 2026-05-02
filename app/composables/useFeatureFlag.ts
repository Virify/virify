export function useFeatureFlag() {
  const flags = getFeatureFlagConfig()
  const { role, roleActive, isAdmin, isAgent } = useRole()

  return {
    ...flags,
    role,
    roleActive,
    isAdmin,
    isAgent
  }
}