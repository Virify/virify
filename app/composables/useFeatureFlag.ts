export function useFeatureFlag() {
  const flags = getFeatureFlagConfig();
  const { role, roleActive, isAdmin, isAgent, isUser } = useRole();

  // ADMIN, AGENT, and USER (subject to ownership verification) can create a listing
  const createListing = computed(() => {
    if (role.value === "ADMIN") return true;
    if (!flags.createListing) return false;
    return role.value === "AGENT" || role.value === "USER";
  });

  return {
    ...flags,
    createListing,
    role,
    roleActive,
    isAdmin,
    isAgent,
    isUser,
    checkFeatureFlag,
  };
}
