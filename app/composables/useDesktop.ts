import { useMediaQuery } from '@vueuse/core'
// @ts-ignore
import { desktopBreakpoint } from '#styles/_utils/breakpoints.module.scss'
import { breakpointsTailwind } from '@vueuse/core'

/**
 *  Check whether the screen size is desktop or not
 */
export function useDesktop() {
  return useMediaQuery(`(min-width: ${desktopBreakpoint})`)
}

export function useTailwindDesktop() {
  return useMediaQuery(`(min-width: ${breakpointsTailwind.lg}px)`)
}