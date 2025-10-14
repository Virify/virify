export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const deploymentEnv = config.public.DEPLOYMENT_ENV

  // Only apply restrictions if deployment environment is 'waiting-list' (waiting list mode)
  if (deploymentEnv !== 'waiting-list') {
    return
  }

  // Define allowed routes in waiting list mode
  const allowedRoutes = [
    '/waiting-list',
    '/terms',
    '/privacy',
    '/price-paid',
    'guides',
  ]

  // Check if the current route is allowed
  const isAllowed = allowedRoutes.some(route => to.path.startsWith(route))

  // If route is not allowed, redirect to waiting list
  if (!isAllowed) {
    return navigateTo('/waiting-list')
  }
})
