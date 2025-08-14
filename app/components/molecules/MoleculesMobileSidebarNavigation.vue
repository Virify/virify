<template>
  <div class="mobile-nav-overlay" :class="{ open: isOpen }" @click="$emit('close')">
    <aside class="mobile-sidebar" @click.stop>
      <div class="mobile-nav-header">
        <h3 class="nav-title">Menu</h3>
        <button class="close-btn" @click="$emit('close')">
          <AtomsIcon icon="cross" size="24" />
        </button>
      </div>
      <nav class="navigation">
        <ul>
          <MoleculesNavigationGroup 
            :groupStates="groupStates"
            @toggleGroup="$emit('toggleGroup', $event)"
            @navClick="handleNavClick"
          />
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  groupStates: boolean[]
}>()

const emit = defineEmits<{
  close: []
  toggleGroup: [index: number]
  navClick: [item: any]
}>()

function handleNavClick(item: any) {
  emit('navClick', item)
  emit('close') // Close mobile menu after navigation
}
</script>

<style lang="scss" scoped>
.mobile-nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.open {
    opacity: 1;
    pointer-events: auto;

    .mobile-sidebar {
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: var(--background-200);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.mobile-nav-header {
  padding: var(--size-16);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .nav-title {
    color: var(--foreground-100);
    margin: 0;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(svg) {
      color: var(--foreground-100);
    }
  }
}

.navigation {
  padding: var(--size-16);
  padding-bottom: calc(var(--size-16) + 80px);

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