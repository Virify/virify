<template>
  <div>
    <MoleculesMobileNavigationBar
      :isMobileMenuOpen="isMobileMenuOpen"
      @toggleMenu="toggleMobileMenu"
    />

    <MoleculesMobileSidebarNavigation 
      :isOpen="isMobileMenuOpen"
      :groupStates="groupStates"
      @close="isMobileMenuOpen = false"
      @toggleGroup="toggleGroup"
      @navClick="handleNavClick"
    />

    <MoleculesDesktopSidebarNavigation 
      :groupStates="groupStates"
      @toggleGroup="toggleGroup"
      @navClick="handleNavClick"
    />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

// Composables
const config = useRuntimeConfig()
const { data } = useWebSocket(config.public.WS_BASE_URL + '/api/_ws/connection')
const { clear } = useUserSession()
const { fetchUserItemsAggregates, getAggregateCount, handleAggregateUpdate } = useNotifications()
const { handleOutgoingMessages } = useWebSocketServer()

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Group accordion states - start with first group open
const groupStates = ref([true, false, false])

// WebSocket Events
const navigationWebSocketEvents = {
  onAggregateUpdate: ({ 
    aggregateType, 
    operation 
  }: { 
    aggregateType: keyof UserItemsAggregates
    operation: 'add' | 'remove' | 'update'
  }) => {
    handleAggregateUpdate({ 
      type: 'aggregate_update',
      aggregateType, 
      operation,
      to: 0,
      timestamp: new Date().toISOString()
    })
  },
}

// WebSocket Message Handlers
watchEffect(() => {
  if (data.value) {
    handleOutgoingMessages(data.value, navigationWebSocketEvents)
  }
})

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
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function handleNavClick(item: any) {
  if (item.action === 'logout') {
    logout()
  } else if (item.action === 'delete') {
    deleteAccount()
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

async function deleteAccount() {
  try {
    await $fetch('/auth/delete', { method: 'DELETE' })
    await clear()
    navigateTo('/')
  } catch (error) {
    console.error('Error deleting account:', error)
  }
}

</script>

<style lang="scss" scoped>
// No styles needed - all styles moved to individual components
</style>