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
  height: fit-content;
  z-index: 10;
  width: 300px;
  position: sticky;
  top: calc(var(--header-offset, 0) + var(--size-16));
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    display: none;
  }
}

.sidebar-content {
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: relative;
}

.navigation {
  padding: var(--size-16);

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