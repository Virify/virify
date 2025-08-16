<template>
  <aside class="sidebar">
    <div class="sidebar-content">
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
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  groupStates: boolean[]
}>()

defineEmits<{
  toggleGroup: [index: number]
  navClick: [item: any]
}>()
</script>

<style lang="scss" scoped>
.sidebar {
  /* use flex so the content can stretch to the available max-height */
  display: flex;
  flex-direction: column;
  height: auto;
  z-index: 10;
  width: 300px;
  position: sticky;
  top: calc(var(--header-offset, 0) + var(--size-16));
  bottom: var(--size-16);
  max-height: calc(100vh - var(--header-offset, 0) - var(--size-48));
  overflow: hidden;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    display: none;
  }
}

.sidebar-content {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* fill the sidebar container and hide overflow; the inner .navigation will scroll */
  height: 100%;
  max-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 1 auto;
}

.navigation {
  /* make the navigation area scroll internally when it's taller than the available space */
  overflow-y: auto;
  max-height: 100%;
  flex: 1 1 auto;

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