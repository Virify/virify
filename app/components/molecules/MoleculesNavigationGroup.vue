<template>
  <template v-for="(group, groupIndex) in navigationGroups" :key="group.title">
    <!-- Group header -->
    <li class="icon-cell" :class="{ 'last-visible': isLastVisibleGroup(groupIndex) }"
      @click="toggleGroup(groupIndex)">
      <AtomsIcon :icon="group.icon" size="32" />
    </li>
    <li class="text-cell group-header" :class="{ 'last-visible': isLastVisibleGroup(groupIndex) }"
      @click="toggleGroup(groupIndex)">
      <span class="body-md font-semibold">{{ group.title }}</span>
      <AtomsIcon icon="chevron-down" size="20" :class="{ 'rotated': groupStates[groupIndex] }" />
    </li>

    <!-- Group items -->
    <template v-for="item in group.items" :key="item.name">
      <li v-if="groupStates[groupIndex]" class="icon-cell group-item">
        <NuxtLink :to="item.url" @click="handleNavClick(item)">
          <AtomsIcon :icon="item.icon" size="22" />
        </NuxtLink>
      </li>
      <li v-if="groupStates[groupIndex]" class="text-cell group-item | body-sm">
        <NuxtLink :to="item.url" @click="handleNavClick(item)">
          {{ item.name }}
          <span v-if="item.countKey && aggregates[item.countKey as keyof UserItemsAggregates]" class="nav-count body-xs font-bold">
            ({{ aggregates[item.countKey as keyof UserItemsAggregates] }})
          </span>
        </NuxtLink>
      </li>
    </template>
  </template>
</template>

<script setup lang="ts">
import { navigationGroups } from '~/utils/account/navigation'

const props = defineProps<{
  groupStates: boolean[]
}>()

const emit = defineEmits<{
  toggleGroup: [index: number]
  navClick: [item: any]
}>()

// Use the notifications composable directly
const { aggregates } = useNotifications()

function toggleGroup(index: number) {
  emit('toggleGroup', index)
}

function handleNavClick(item: any) {
  emit('navClick', item)
}

function isLastVisibleGroup(groupIndex: number) {
  // If this group is expanded, it's never the last visible (its items are)
  if (props.groupStates[groupIndex]) {
    return false
  }

  // If this group is collapsed, check if it's the last collapsed group
  // or if all groups after it are also collapsed
  for (let i = groupIndex + 1; i < navigationGroups.length; i++) {
    // If we find any group after this one that has visible content (header or items)
    return false
  }

  return true
}
</script>

<style lang="scss" scoped>
.icon-cell {
  background: var(--secondary-400);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s ease;
  text-decoration: none;
  color: inherit;
  position: relative;
  padding: var(--size-12) var(--size-16);

  &:hover {
    opacity: 0.8;
  }

  &:first-child {
    border-top-left-radius: var(--border-radius-xl);
    border-top-right-radius: var(--border-radius-xl);
  }

  &.last-visible {
    border-bottom-left-radius: var(--border-radius-xl);
    border-bottom-right-radius: var(--border-radius-xl);
  }

  &:nth-last-child(2) {
    border-bottom-left-radius: var(--border-radius-xl);
    border-bottom-right-radius: var(--border-radius-xl);
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }

  :deep(svg) {
    color: var(--background-200);
  }
}

.text-cell {
  background: var(--background-200);
  display: flex;
  align-items: center;
  padding: 0 var(--size-16);
  color: var(--foreground-100);

  &.last-visible {
    border-bottom-right-radius: var(--border-radius-xl);
  }

  &.group-header {
    cursor: pointer;
    justify-content: space-between;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    :deep(svg) {
      transition: transform 0.3s ease;

      &.rotated {
        transform: rotate(180deg);
      }
    }
  }

  a {
    color: inherit;
    padding: 0 var(--size-8);
    text-decoration: none;
    border-radius: var(--border-radius-md);
    transition: background 0.2s ease;
    width: 100%;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  .nav-count {
    color: var(--secondary-400);
    margin-left: var(--size-4);
  }
}
</style>