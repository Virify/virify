import { ViewsDialogLogin, ViewsDialogSignup } from '#components'

const buildActionItems = getActionItemsBuilder()
const baseCenterItems = computed(getBaseCenterItems)

type NavigationDataRef = Ref<SanityGuideCategory[] | null | undefined> | undefined

export interface NavigationDropdownOpenOptions {
  trigger?: HTMLElement | null
  defaultCategoryId?: string | null
}

export interface NavigationDropdownControls {
  openItemId: Ref<string | null>
  activeCategoryId: Ref<string | null>
  isOpen: ComputedRef<boolean>
  open: (itemId: string, options?: NavigationDropdownOpenOptions) => void
  close: (options?: { returnFocus?: boolean }) => void
  toggle: (itemId: string, options?: NavigationDropdownOpenOptions) => void
  setActiveCategory: (categoryId: string | null) => void
}

export interface NavigationComposable {
  navigationItems: ComputedRef<NavigationItem[]>
  centerItems: ComputedRef<NavigationItem[]>
  actionItems: ComputedRef<NavigationItem[]>
  guidesChildren: ComputedRef<NavigationItem['children']>
  isMobileMenuOpen: Ref<boolean>
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  openLogin: () => void
  openSignup: () => void
  logout: () => Promise<void>
  dropdown: NavigationDropdownControls
}

const isClient = () => typeof window !== 'undefined'

export const useNavigation = (navigationData?: NavigationDataRef): NavigationComposable => {
  const session = useUserSession()
  const dialog = useDialog()

  const isMobileMenuOpen = ref(false)
  const openItemId = ref<string | null>(null)
  const activeCategoryId = ref<string | null>(null)
  const lastTrigger = ref<HTMLElement | null>(null)

  const guidesChildren = computed(() => mapSanityGuidesToNavigationChildren(navigationData?.value ?? []))

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }

  function openLogin() {
    dialog.showDialog({ component: ViewsDialogLogin })
    closeMobileMenu()
  }

  function openSignup() {
    dialog.showDialog({ component: ViewsDialogSignup })
    closeMobileMenu()
  }

  async function logout() {
    await session.clear?.()
    navigateTo('/')
    closeMobileMenu()
  }

  function openDropdown(itemId: string, options?: NavigationDropdownOpenOptions) {
    openItemId.value = itemId

    if (options?.defaultCategoryId !== undefined) {
      activeCategoryId.value = options.defaultCategoryId ?? null
    }

    if (options?.trigger) {
      lastTrigger.value = options.trigger
    }
  }

  function closeDropdown(options?: { returnFocus?: boolean }) {
    if (openItemId.value === null) return

    const { returnFocus = true } = options ?? {}
    const trigger = lastTrigger.value

    openItemId.value = null
    activeCategoryId.value = null
    lastTrigger.value = null

    if (returnFocus && isClient()) {
      nextTick(() => {
        trigger?.focus()
      })
    }
  }

  function toggleDropdown(itemId: string, options?: NavigationDropdownOpenOptions) {
    if (openItemId.value === itemId) {
      closeDropdown()
      return
    }

    openDropdown(itemId, options)
  }

  function setActiveCategory(categoryId: string | null) {
    activeCategoryId.value = categoryId
  }

  const centerItems: ComputedRef<NavigationItem[]> = computed(() =>
    baseCenterItems.value.map((item) => {
      if (item.id === 'guides') {
        return { ...item, children: guidesChildren.value }
      }

      return { ...item }
    })
  )

  const actionItems: ComputedRef<NavigationItem[]> = computed(() =>
    buildActionItems({
      loggedIn: session.loggedIn.value,
      actions: {
        openLogin,
        openSignup,
        logout,
      },
    })
  )

  const navigationItems: ComputedRef<NavigationItem[]> = computed(() => [...centerItems.value, ...actionItems.value])
  const isDropdownOpen = computed(() => openItemId.value !== null)

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isDropdownOpen.value) {
      event.preventDefault()
      closeDropdown()
    }
  }

  onMounted(() => {
    if (!isClient()) return
    
    // Close mobile menu on route change
    const route = useRoute()
    watch(() => route.path, () => {
      if (isMobileMenuOpen.value) {
        closeMobileMenu()
      }
    })
    
    // Global escape key handler
    document.addEventListener('keydown', handleKeydown)
    
    // Watch for screen size changes to close mobile menu when transitioning to desktop
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches && isMobileMenuOpen.value) {
        closeMobileMenu()
      }
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)
    
    // Store cleanup function
    const cleanup = () => {
      document.removeEventListener('keydown', handleKeydown)
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
    
    onUnmounted(cleanup)
  })

  const dropdown: NavigationDropdownControls = {
    openItemId,
    activeCategoryId,
    isOpen: isDropdownOpen,
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
    setActiveCategory,
  }

  return {
    navigationItems,
    centerItems,
    actionItems,
    guidesChildren,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    openLogin,
    openSignup,
    logout,
    dropdown,
  }
}

export const useNavigationWithData = async () => {
  const { useNavigationData } = useSanity()
  const { data } = await useNavigationData()
  return useNavigation(data)
}
