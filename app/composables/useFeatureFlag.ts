export function useFeatureFlag() {
  const flags = getFeatureFlagConfig()
  const { role, roleActive, isAdmin, isAgent } = useRole()

  // Only ADMIN or AGENT (Estate Agent) roles can create a listing
  const createListing = computed(() => {
    if (role.value === 'ADMIN') return true

    return !!(flags.createListing && role.value === 'AGENT')
  })

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