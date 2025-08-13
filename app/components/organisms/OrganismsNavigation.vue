<template>
  <div>
    <MoleculesMobileNavigationBar :isMobileMenuOpen="isMobileMenuOpen" :isChatSummaryOpen="isChatSummaryOpen" @toggleMenu="toggleMobileMenu"
      @toggleChat="toggleChatSummary" @closeBoth="closeBothOverlays" />

    <MoleculesMobileSidebarNavigation :isOpen="isMobileMenuOpen" :groupStates="groupStates"
      @close="isMobileMenuOpen = false" @toggleGroup="toggleGroup" @navClick="handleNavClick" />

    <OrganismsMobileChatSummary :isOpen="isChatSummaryOpen" @close="toggleChatSummary" />

    <MoleculesDesktopSidebarNavigation :groupStates="groupStates" @toggleGroup="toggleGroup"
      @navClick="handleNavClick" />
  </div>
</template>

<script setup lang="ts">
// Composables
const config = useRuntimeConfig()
// const { data } = useWebSocket(config.public.WS_BASE_URL + '/api/_ws/connection')
const { clear } = useUserSession()
const { fetchUserItemsAggregates } = useNotifications()

const isMobileMenuOpen = ref(false)
const isChatSummaryOpen = ref(false)
const groupStates = ref([true, false, false])

// Lifecycle
onMounted(() => {
  fetchUserItemsAggregates()
})

function toggleGroup(index: number) {
  // If this group is already open, close it
  if (groupStates.value[index]) {
    groupStates.value[index] = false
  } else {
    // Close all groups first, then open the selected one
    groupStates.value = groupStates.value.map(() => false)
    groupStates.value[index] = true
  }
}

function toggleMobileMenu() {
  const wasMenuOpen = isMobileMenuOpen.value
  
  // Close all overlays first
  isMobileMenuOpen.value = false
  isChatSummaryOpen.value = false
  
  // If menu wasn't already open, open it
  if (!wasMenuOpen) {
    isMobileMenuOpen.value = true
  }
}

function toggleChatSummary() {
  const wasChatOpen = isChatSummaryOpen.value
  
  // Close all overlays first
  isMobileMenuOpen.value = false
  isChatSummaryOpen.value = false
  
  // If chat wasn't already open, open it
  if (!wasChatOpen) {
    isChatSummaryOpen.value = true
  }
}

function closeBothOverlays() {
  isMobileMenuOpen.value = false
  isChatSummaryOpen.value = false
}

function handleNavClick(item: any) {
  if (item.action === 'logout') {
    logout()
  }
}

// Navigation Actions
async function logout() {
  await clear()

  // Only redirect to homepage if currently on /account routes
  const route = useRoute()
  if (route.path.startsWith('/account')) {
    navigateTo('/')
  }
}
</script>