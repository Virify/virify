<template>
  <div class="o-site-navigation__drawer-category">
    <div class="o-site-navigation__drawer-category-wrapper">
      <!-- Category Link -->
      <NuxtLink
        v-if="category.href"
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
      <span
        v-else
        class="o-site-navigation__drawer-category-label | body-sm"
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
      </span>

      <!-- Toggle Button -->
      <button
        type="button"
        class="o-site-navigation__drawer-category-toggle"
        :aria-expanded="isExpanded"
        @click="toggleExpanded"
        @keydown="handleKeydown"
      >
        <AtomsIcon
          icon="chevron-down"
          width="14"
          height="14"
          class="o-site-navigation__drawer-chevron"
          :class="{ 'is-expanded': isExpanded }"
        />
      </button>
    </div>

    <!-- Guides List -->
    <div
      v-if="isExpanded"
      class="o-site-navigation__drawer-sub-list-wrapper"
    >
      <ul class="o-site-navigation__drawer-sub-list">
        <li v-for="guide in category.children || []" :key="guide.id">
          <NuxtLink
            v-if="guide.href"
            :to="guide.href"
            class="o-site-navigation__drawer-sub-link | body-sm"
            @click="$emit('close')"
          >
            <span class="o-site-navigation__drawer-summary-content">
              <AtomsIcon
                v-if="guide.icon"
                :icon="guide.icon"
                width="14"
                height="14"
                class="o-site-navigation__drawer-icon"
              />
              <span class="o-site-navigation__drawer-text">{{ guide.label }}</span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  category: NavigationSubItem
}>()

defineEmits<{
  close: []
}>()

const isExpanded = ref(false)

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault()
    toggleExpanded()
  } else if (event.key === 'Enter') {
    event.preventDefault()
    toggleExpanded()
  } else if (event.key === 'Escape' && isExpanded.value) {
    event.preventDefault()
    isExpanded.value = false
  }
}
</script>

<style lang="scss" scoped>
.o-site-navigation__drawer-category {
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--border-radius-md);

  &-wrapper {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    padding: var(--size-4);
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--border-radius-md);
  }

  &-link {
    flex: 1;
    display: block;
    padding: var(--size-8);
    border-radius: var(--border-radius-md);
    text-decoration: none;
    color: inherit;
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  &-label {
    flex: 1;
    display: block;
    padding: var(--size-8);
    color: inherit;
  }

  &-toggle {
    background: rgba(255, 255, 255, 0.08);
    border: none;
    color: inherit;
    cursor: pointer;
    padding: var(--size-16);
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.15s ease-in-out;

    &:hover,
    &:focus-visible {
      background: rgba(255, 255, 255, 0.08);
    }

    .o-site-navigation__drawer-chevron {
      transition: transform 0.2s ease;
      
      &.is-expanded {
        transform: rotate(180deg);
      }
    }
  }
}

.o-site-navigation__drawer-summary-content {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  flex: 1;
}

.o-site-navigation__drawer-sub-list {
  list-style: none;
  margin: 0;
  padding: 0 var(--size-4) var(--size-4);
  display: grid;
  gap: var(--size-6);

  &-wrapper {
    margin-top: var(--size-4);
    padding: var(--size-4);
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--border-radius-md);
  }
}

.o-site-navigation__drawer-sub-link {
  display: block;
  padding: var(--size-8);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s ease-in-out;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.12);
  }
}

.o-site-navigation__drawer-icon {
  flex-shrink: 0;
}

.o-site-navigation__drawer-text {
  flex: 1;
}
</style>