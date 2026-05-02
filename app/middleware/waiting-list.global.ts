import pm from 'picomatch'

const alwaysAllowedRoutes = [
  '/contact/**',
  '/terms/**',
  '/privacy/**',
  '/guides/**',
  '/listing/**',
  '/price-paid/**',
  '/cookie/**',
  '/support/**',
]

const featureFlagRoutes = {
  '/search/**': ['search'],
  '/login/**': ['signup'],
  '/account/**': ['signup'],
  '/dashboard/**': ['signup'],
}

export default defineNuxtRouteMiddleware(({ path }) => {
  const { isAdmin, checkFeatureFlag } = useFeatureFlag()

  // Admin can access any route
  if (isAdmin.value) return

  // Homepage is always accessible
  if (path === '/') return

  // There is also a list of additional routes that should always
  // be accessible
  for (const route of alwaysAllowedRoutes) {
    const getMatch = pm(route)
    const isMatch = getMatch(path)

    if (isMatch) return
  }

  // Then check for a list of feature-flagged routes
  for (const [route, flags] of Object.entries(featureFlagRoutes)) {
    const getMatch = pm(route)
    const isMatch = getMatch(path)

    // If no match, carry on to next route
    if (!isMatch) continue

    // Otherwise loop through available flags and check they are allowed
    for (const flag of flags) {
      const isAllowed = checkFeatureFlag(flag)

      if (isAllowed) return
    }
  }

  // Navigate user to homepage
  return navigateTo('/')
})
