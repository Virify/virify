<template>
  <div>
    <MoleculesNavigationAccountMobileBar :isMobileMenuOpen="isMobileMenuOpen" :isChatSummaryOpen="isChatSummaryOpen" @toggleMenu="toggleMobileMenu"
      @toggleChat="toggleChatSummary" @closeBoth="closeBothOverlays" />

    <MoleculesNavigationAccountMobileOverlay :isOpen="isMobileMenuOpen" :groupStates="groupStates"
      @close="isMobileMenuOpen = false" @toggleGroup="toggleGroup" @navClick="handleNavClick" />

    <OrganismsEnquiryMobileSummary :isOpen="isChatSummaryOpen" @close="toggleChatSummary" />
  </div>
</template>

<script setup lang="ts">
const { clear } = useUserSession()
const { fetchUserItemsAggregates } = useNotifications()

const isMobileMenuOpen = ref(false)
const isChatSummaryOpen = ref(false)
const groupStates = ref([true, true, true, false])

onMounted(() => {
  fetchUserItemsAggregates()
})

function toggleGroup(index: number) {
  groupStates.value[index] = !groupStates.value[index]
}

function toggleMobileMenu() {
  const wasMenuOpen = isMobileMenuOpen.value
  isMobileMenuOpen.value = false
  isChatSummaryOpen.value = false
  if (!wasMenuOpen) {
    isMobileMenuOpen.value = true
  }
}

function toggleChatSummary() {
  const wasChatOpen = isChatSummaryOpen.value
  isMobileMenuOpen.value = false
  isChatSummaryOpen.value = false
  if (!wasChatOpen) {
    isChatSummaryOpen.value = true
  }
}

function closeBothOverlays() {
  isMobileMenuOpen.value = false
  isChatSummaryOpen.value = false
}

// Prevent body scrolling on mobile when either mobile menu or chat is open
watch([isMobileMenuOpen, isChatSummaryOpen], ([menuOpen, chatOpen]) => {
  const shouldBlock = !!menuOpen || !!chatOpen
  if (import.meta.client) {
    document.body.classList.toggle('no-scroll', shouldBlock)
  }
})

function handleNavClick(item: any) {
  if (item.action === 'logout') {
    logout()
  }
}

async function logout() {
  await clear()
  const route = useRoute()
  if (route.path.startsWith('/account')) {
    navigateTo('/')
  }
}
</script>