export function useFeatureFlag() {
  const flags = getFeatureFlagConfig()
  const { role, roleActive, isAdmin, isAgent } = useRole()

  // @TODO temporary override to only allow create listing for EAs
  const createListing = computed(() => {
    if (role.value === 'ADMIN') return true

    return !!(flags.createListing && role.value === 'AGENT')
  })
  // End @TODO

  return {
    ...flags,
    createListing,
    role,
    roleActive,
    isAdmin,
    isAgent,
    checkFeatureFlag
  }
}