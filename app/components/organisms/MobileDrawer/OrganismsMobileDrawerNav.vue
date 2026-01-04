<template>
  <nav class="o-site-navigation__drawer-nav">
    <ul class="o-site-navigation__drawer-list">
      <li v-for="item in primaryItems" :key="item.id" class="o-site-navigation__drawer-item">
        <!-- Simple Link -->
        <NuxtLink v-if="item.type === 'link' && item.href" :to="item.href"
          class="o-site-navigation-link | o-site-navigation__drawer-link" @click="$emit('close')">
          <span class="o-site-navigation__drawer-link-content">
            <AtomsIcon v-if="item.icon" :icon="item.icon" width="16" height="16"
              class="o-site-navigation__drawer-icon" />
            <span class="o-site-navigation__drawer-text | body-sm">{{ item.label }}</span>
          </span>
        </NuxtLink>

        <!-- Button -->
        <button v-else-if="item.type === 'button'" type="button"
          :class="`o-site-navigation-link | button ${item.buttonClass || 'button-monochrome'} button-sm | o-site-navigation__drawer-link`"
          @click.prevent="handleAction(item.action)">
          <span class="o-site-navigation__drawer-link-content">
            <AtomsIcon v-if="item.icon" :icon="item.icon" width="16" height="16"
              class="o-site-navigation__drawer-icon" />
            <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
          </span>
        </button>

        <!-- Dropdown with Categories -->
        <OrganismsMobileDrawerDropdown v-else-if="item.type === 'dropdown' && hasChildCategories(item)" :item="item"
          @close="$emit('close')" />

        <!-- Fallback Link -->
        <NuxtLink v-else-if="item.href" :to="item.href"
          class="o-site-navigation-link | button button-monochrome button-sm | o-site-navigation__drawer-link"
          @click="$emit('close')">
          <span class="o-site-navigation__drawer-link-content">
            <AtomsIcon v-if="item.icon" :icon="item.icon" width="16" height="16"
              class="o-site-navigation__drawer-icon" />
            <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
          </span>
        </NuxtLink>

        <!-- Plain Text (No Link) -->
        <span v-else class="o-site-navigation__drawer-plain | body-sm">
          <span class="o-site-navigation__drawer-link-content">
            <AtomsIcon v-if="item.icon" :icon="item.icon" width="16" height="16"
              class="o-site-navigation__drawer-icon" />
            <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
          </span>
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">

defineProps<{
  primaryItems: NavigationItem[]
}>()

const emit = defineEmits<{
  close: []
}>()

function handleAction(fn?: () => void) {
  if (fn) fn()
  emit('close')
}

function hasChildCategories(item: NavigationItem) {
  return Array.isArray(item.children) && item.children.length > 0
}
</script>

<style lang="scss" scoped>
.o-site-navigation__drawer-nav {
  flex: 1;
  overflow-y: auto;
  padding: var(--size-16);
}

.o-site-navigation__drawer {
  &-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);
  }

  &-item {
    display: flex;
  }

  &-link,
  &-plain {
    width: 100%;
    cursor: pointer;
    padding: var(--size-10);
    border-radius: var(--border-radius-md);
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-8);
    background: rgba(255, 255, 255, 0.02);
    list-style: none;
    transition: background-color 0.15s ease-in-out;

    &-content {
      display: flex;
      align-items: center;
      gap: var(--size-8);
      width: 100%;
    }
  }

  &-icon {
    flex-shrink: 0;
  }

  &-text {
    flex: 1;
  }
}
</style>