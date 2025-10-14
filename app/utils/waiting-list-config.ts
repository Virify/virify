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
  /** Navigation items to show in waiting-list mode */
  navigation: {
    showSearch: boolean
    showAuth: boolean
    showAccount: boolean
  }
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
    '/waiting-list',
    '/contact',
    '/terms',
    '/privacy',
    '/price-paid',
    '/guides',
    '/login',
  ],

  // Navigation visibility
  navigation: {
    showSearch: false,
    showAuth: false,
    showAccount: false,
  },

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
  const isWaitingListMode = computed(() => config.public.DEPLOYMENT_ENV === 'waiting-list')
  
  return {
    isWaitingListMode,
    config: waitingListConfig,
  }
}

/**
 * Check if a route is allowed in waiting-list mode
 */
export const isRouteAllowed = (path: string): boolean => {
  return waitingListConfig.allowedRoutes.some(route => path.startsWith(route))
}

/**
 * Get the waiting list configuration
 */
export const getWaitingListConfig = (): WaitingListConfig => {
  return waitingListConfig
}
