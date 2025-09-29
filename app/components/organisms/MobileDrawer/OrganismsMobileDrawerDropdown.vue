<template>
  <details ref="detailsRef" class="o-site-navigation__drawer-group" @keydown="handleKeydown">
    <summary class="o-site-navigation__drawer-summary | body-sm">
      <span class="o-site-navigation__drawer-summary-content">
        <AtomsIcon
          v-if="item.icon"
          :icon="item.icon"
          width="16"
          height="16"
          class="o-site-navigation__drawer-icon"
        />
        <span class="o-site-navigation__drawer-text">{{ item.label }}</span>
      </span>
      <AtomsIcon
        icon="chevron-down"
        width="16"
        height="16"
        class="o-site-navigation__drawer-chevron"
      />
    </summary>

    <div class="o-site-navigation__drawer-children">
      <!-- Main Category Link Button -->
      <NuxtLink
        v-if="item.href"
        :to="item.href"
        class="o-site-navigation__drawer-main-link | button button-monochrome button-sm"
        @click="$emit('close')"
      >
        Browse all {{ item.label.toLowerCase() }}
      </NuxtLink>

      <template v-for="category in item.children || []" :key="category.id">
        <!-- Category with Guides (Third Level) -->
        <OrganismsMobileDrawerCategory
          v-if="hasThirdLevel(category)"
          :category="category"
          @close="$emit('close')"
        />

        <!-- Simple Category Link -->
        <NuxtLink
          v-else-if="category.href"
          :to="category.href"
          class="o-site-navigation__drawer-category-link | body-sm"
          @click="$emit('close')"
        >
          <span class="o-site-navigation__drawer-summary-content">
            <AtomsIcon
              v-if="category.icon"
              :icon="category.icon"
              width="14"
              height="14"
              class="o-site-navigation__drawer-icon"
            />
            <span class="o-site-navigation__drawer-text">{{ category.label }}</span>
          </span>
        </NuxtLink>

        <!-- Category Label (No Link) -->
        <span v-else class="o-site-navigation__drawer-category-label | body-sm">
          <span class="o-site-navigation__drawer-summary-content">
            <AtomsIcon
              v-if="category.icon"
              :icon="category.icon"
              width="14"
              height="14"
              class="o-site-navigation__drawer-icon"
            />
            <span class="o-site-navigation__drawer-text">{{ category.label }}</span>
          </span>
        </span>
      </template>
    </div>
  </details>
</template>

<script setup lang="ts">

defineProps<{
  item: NavigationItem
}>()

defineEmits<{
  close: []
}>()

const detailsRef = ref<HTMLDetailsElement | null>(null)

function hasThirdLevel(category: NavigationSubItem) {
  return Array.isArray(category.children) && category.children.length > 0
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === ' ' || event.key === 'Spacebar') {
    return
  } else if (event.key === 'Enter') {
    return
  } else if (event.key === 'Escape' && detailsRef.value?.open) {
    event.preventDefault()
    event.stopPropagation()
    detailsRef.value.open = false
    nextTick(() => {
      const summary = detailsRef.value?.querySelector('summary') as HTMLElement
      summary?.focus()
    })
  }
}
</script>

<style lang="scss" scoped>
.o-site-navigation__drawer-group {
  width: 100%;
}

.o-site-navigation__drawer-summary {
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

  &::-webkit-details-marker {
    display: none;
  }

  &::marker {
    display: none;
  }

  &-content {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    flex: 1;
  }
}

.o-site-navigation__drawer-chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

details[open] .o-site-navigation__drawer-chevron {
  transform: rotate(180deg);
}

.o-site-navigation__drawer-children {
  padding: var(--size-8) var(--size-12) var(--size-6);
  display: grid;
  gap: var(--size-12);
}

.o-site-navigation__drawer {
  &-main-link {
    width: 100%;
    justify-content: center;
    margin: var(--size-2);
  }
}

.o-site-navigation__drawer-category {
  &-link {
    display: block;
    padding: var(--size-10);
    border-radius: var(--border-radius-md);
    background: rgba(255, 255, 255, 0.04);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, 0.12);
    }
  }

  &-label {
    display: block;
    padding: var(--size-10);
    border-radius: var(--border-radius-md);
    background: rgba(255, 255, 255, 0.02);
    color: inherit;
  }
}

.o-site-navigation__drawer-icon {
  flex-shrink: 0;
}

.o-site-navigation__drawer-text {
  flex: 1;
}
</style>