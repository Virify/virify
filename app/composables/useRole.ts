export function useRole() {
  const { user } = useUserSession()

  const role = computed(() => getRole(user.value))
  const roleActive = computed(() => getRoleActive(user.value))
  const isAdmin = computed(() => role.value === 'ADMIN')
  const isAgent = computed(() => role.value === 'AGENT')
  const isUser = computed(() => role.value === 'USER')

  return {
    role,
    roleActive,
    isAdmin,
    isAgent,
    isUser,
  }
}