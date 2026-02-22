/**
 * Waiting List Mode Configuration
 * 
 * This file centralizes all configuration related to waiting-list deployment mode.
 * Use this to control which features, routes, and UI elements are available when
 * the app is in waiting-list mode (DEPLOYMENT_ENV=waiting-list).
 */

export interface WaitingListConfig {
  /** Routes that are accessible in waiting-list mode */
  allowedRoutes: string[]
  /** Footer sections to show in waiting-list mode */
  footer: {
    showPropertySearch: boolean
    showSellProperty: boolean
    showPropertyTools: boolean
    showGuides: boolean
    showCompany: boolean
  }
}

/**
 * Waiting list mode configuration
 */
const waitingListConfig: WaitingListConfig = {
  // Routes accessible in waiting-list mode
  allowedRoutes: [
    '/',
    '/contact',
    '/terms',
    '/privacy',
    '/price-paid',
    '/guides/*', // allow all guide subroutes
    '/guides',   // allow /guides root
    '/login',
    '/cookie',
    '/support',
    '/listing/*',
    '/listing/preview/*',
    '/account',
    '/account/*',
    '/dashboard',
    '/dashboard/*',
    // '/mortgage-calculator',
  ],

  // Footer sections visibility
  footer: {
    showPropertySearch: false,
    showSellProperty: false,
    showPropertyTools: true,
    showGuides: true,
    showCompany: true,
  },
}

/**
 * Check if the app is in waiting-list mode
 */
export const useWaitingListMode = () => {
  const config = useRuntimeConfig()
  const isWaitingListMode = computed(() => {
    const { query } = useRoute()

    return query.waitList === 'true' || config.public.DEPLOYMENT_ENV === 'waiting-list'
  })

  return {
    isWaitingListMode,
    config: waitingListConfig,
  }
}

/**
 * Check if a route is allowed in waiting-list mode
 * Supports wildcard ("/*") at the end of allowedRoutes for prefix matching
 */
export const isRouteAllowed = (path: string): boolean => {
  // Remove trailing slash for comparison
  const normalize = (str: string) => str.replace(/\/$/, '')
  const normalizedPath = normalize(path)
  return waitingListConfig.allowedRoutes.some(route => {
    const normalizedRoute = normalize(route)
    if (normalizedRoute.endsWith('/*')) {
      // Prefix match for wildcard routes
      const prefix = normalizedRoute.slice(0, -1) // remove the '*'
      return normalizedPath.startsWith(prefix)
    }
    // Exact match for non-wildcard routes
    return normalizedRoute === normalizedPath
  })
}

/**
 * Get the waiting list configuration
 */
export const getWaitingListConfig = (): WaitingListConfig => {
  return waitingListConfig
}
