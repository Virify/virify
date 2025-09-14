<template>
  <div ref="sidebarContent" class="navigation-container">
      <nav class="navigation" role="navigation" aria-label="Desktop sidebar navigation">
        <ul>
          <MoleculesNavigationGroup 
            :groupStates="groupStates"
            @toggleGroup="$emit('toggleGroup', $event)"
            @navClick="$emit('navClick', $event)"
          />
        </ul>
      </nav>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  groupStates: boolean[]
}>()

defineEmits<{
  toggleGroup: [index: number]
  navClick: [item: any]
}>()

const sidebarContent = ref<HTMLElement>()

// Update CSS custom property with height
const updateHeight = () => {
  if (sidebarContent.value && import.meta.client) {
    const height = sidebarContent.value.offsetHeight
    document.documentElement.style.setProperty('--navigation-sidebar-height', `${height}px`)
  }
}

// Store resizeObserver ref for cleanup
let resizeObserver: ResizeObserver | null = null

// Watch for changes and update height
onMounted(() => {
  nextTick(() => {
    updateHeight()
    // Watch for content changes using ResizeObserver
    if (sidebarContent.value) {
      resizeObserver = new ResizeObserver(() => {
        // Use requestAnimationFrame instead of setTimeout for better timing
        requestAnimationFrame(() => {
          updateHeight()
        })
      })
      resizeObserver.observe(sidebarContent.value)
    }
  })
})


// Cleanup on unmount
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<style lang="scss" scoped>
.navigation-container {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: relative;
  padding: 0 var(--size-8) 0 0;
  transition: height 0.3s ease;
  overflow: hidden;
}

.navigation {
  ul {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0;
    margin: 0;
    padding: 0;
    list-style: none;
  }
}
</style>