export interface NavigationThirdItem {
  id: string
  label: string
  href: string
  description?: string
  icon?: string
}

export interface NavigationSubItem {
  id: string
  label: string
  href: string
  description?: string
  icon?: string
  children?: NavigationThirdItem[]
}

export interface NavigationItem {
  id: string
  label: string
  href?: string
  requiresAuth?: boolean
  hideWhenAuth?: boolean
  type?: 'link' | 'button' | 'dropdown'
  icon?: string
  action?: () => void
  /** Optional button style class e.g. 'button-tertiary', 'button-secondary' */
  buttonClass?: string
  children?: NavigationSubItem[]
}
