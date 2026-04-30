
export function useRole() {
  const { user } = useUserSession()

  const role = computed(() => getRole(user.value))
  const roleActive = computed(() => getRoleActive(user.value))

  return {
    role,
    roleActive
  }
}