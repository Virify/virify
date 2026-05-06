export function useRole() {
  const { user } = useUserSession()

  const role = computed(() => getRole(user.value))
  const roleActive = computed(() => getRoleActive(user.value))
  const isAdmin = computed(() => role.value === 'ADMIN')
  const isAgent = computed(() => role.value === 'AGENT')

  return {
    role,
    roleActive,
    isAdmin,
    isAgent
  }
}