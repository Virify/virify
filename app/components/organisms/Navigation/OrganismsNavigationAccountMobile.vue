<template>
  <div>
    <MoleculesNavigationAccountMobileBar :isMobileMenuOpen="isMobileMenuOpen" @toggleMenu="toggleMobileMenu"
      @closeBoth="closeBothOverlays" />

    <MoleculesNavigationAccountMobileOverlay :isOpen="isMobileMenuOpen" :groupStates="groupStates"
      @close="isMobileMenuOpen = false" @toggleGroup="toggleGroup" @navClick="handleNavClick" />

  </div>
</template>

<script setup lang="ts">
const { clear } = useUserSession()
const { fetchUserItemsAggregates } = useNotifications()

const isMobileMenuOpen = ref(false)
const groupStates = ref([true, true, true, false])

onMounted(() => {
  fetchUserItemsAggregates()
})

function toggleGroup(index: number) {
  groupStates.value[index] = !groupStates.value[index]
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeBothOverlays() {
  isMobileMenuOpen.value = false
}

// Prevent body scrolling on mobile when mobile menu is open
watch(isMobileMenuOpen, (menuOpen) => {
  const shouldBlock = !!menuOpen
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