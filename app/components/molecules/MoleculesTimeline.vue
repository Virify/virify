<template>
  <div class="timeline">
    <div v-if="title || address || type || duration" class="timeline__header">
      <h3 v-if="title" class="timeline__title | title-xs">{{ title }}</h3>
      <div v-if="type || duration" class="timeline__pills">
        <AtomsPill v-if="type" class="timeline__type-pill | body-xs">{{ type }}</AtomsPill>
        <AtomsPill v-if="duration" class="timeline__duration-pill | body-xs">{{ duration }}</AtomsPill>
      </div>
      <p v-if="address" class="timeline__address | body-sm">{{ address }}</p>
    </div>

    <ol class="timeline__list">
      <!-- Skeleton loading items -->
      <li v-if="loading" v-for="n in skeletonCount" :key="`skeleton-${n}`" class="timeline__item">
        <header class="timeline__item-header">
          <AtomsSkeletonBar loading :width="180" :height="20" />
          <AtomsSkeletonBar loading :width="60" :height="24" />
        </header>
        <AtomsSkeletonBar loading :width="100" :height="16" />
      </li>

      <!-- Actual data items -->
      <li v-if="!loading" v-for="item in displayItems" :key="item.id" class="timeline__item">
        <header class="timeline__item-header">
          <h4 class="timeline__item-title | title-xs">{{ item.title }}</h4>
          <AtomsPill v-if="item.badge" class="pill | body-xs" :class="item.badgeColor">
            {{ item.badge }}
          </AtomsPill>
        </header>
        <time v-if="item.date" class="timeline__item-date | body-sm" :datetime="formatDatetime(item.date)">
          {{ formatDisplayDate(item.date) }}
        </time>
      </li>

      <!-- Render the no more history card (always visible at the end of the timeline) -->
      <li class="timeline__item timeline__item--no-history">
        <p class="timeline__no-history-message | body-sm">No more property history available</p>
      </li>
    </ol>

    <p v-if="note" class="timeline__note | body-xs">{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
interface TimelineItem {
  id: string
  title: string
  date?: string | Date
  badge?: string | number
  badgeColor?: string
}

interface Props {
  title?: string
  address?: string
  type?: string
  duration?: string
  items: TimelineItem[]
  reversed?: boolean
  note?: string
  loading?: boolean
  skeletonCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  skeletonCount: 3
})

const displayItems = computed(() => {
  return props.reversed ? [...props.items].reverse() : props.items
})

const formatDatetime = (date: string | Date): string => {
  return new Date(date).toISOString()
}

const formatDisplayDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-GB")
}
</script>

<style lang="scss" scoped>
.timeline {
  &__header {
    margin-bottom: var(--size-16);
  }

  &__title {
    margin: 0 0 var(--size-8) 0;
    color: var(--foreground-100);
  }

  &__pills {
    display: flex;
    gap: var(--size-8);
    margin-bottom: var(--size-4);
  }

  &__type-pill {
    background: var(--primary-400);
    color: var(--monochrome-900);
  }

  &__duration-pill {
    background: var(--primary-400);
    color: var(--monochrome-900);
  }

  &__address {
    margin: 0;
    color: var(--foreground-200);
    font-style: italic;
  }

  &__list {
    list-style: none;
    padding: 0;
    padding-left: var(--size-48);
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    position: relative;
    margin: 0;

  }

  &__item {
    background: var(--background-200);
    border: 1px solid var(--monochrome-600);
    border-radius: var(--border-radius-lg);
    padding: var(--size-16);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: relative;

    // Timeline ball
    &::before {
      content: "";
      position: absolute;
      left: calc(-1 * var(--size-48) + var(--size-14));
      top: var(--size-16);
      width: var(--size-16);
      height: var(--size-16);
      background-color: var(--primary-400);
      border-radius: 50%;
      z-index: 2;
      transform: translateX(-50%);
    }

    // Highlight first item
    &:first-child::before {
      border: 3px solid var(--blue-500);
      box-sizing: content-box;
      top: calc(var(--size-16) - 3px);
    }

    // Timeline connecting line
    &::after {
      content: "";
      position: absolute;
      left: calc(-1 * var(--size-48) + var(--size-14));
      top: calc(var(--size-16) + var(--size-16));
      width: 2px;
      height: calc(100% + var(--size-16));
      background-color: var(--primary-400);
      z-index: 1;
      transform: translateX(-50%);
    }

    &:last-child::after {
      display: none;
    }

    // No history item styling
    &--no-history {
      background: var(--background-200);
      border: 1px dashed var(--monochrome-600);
      text-align: center;
    }
  }

  &__no-history-message {
    margin: 0;
    color: var(--foreground-200);
    font-style: italic;
  }

  &__item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--size-12);
    margin-bottom: var(--size-4);
  }

  &__item-title {
    flex: 1;
    margin: 0;
  }

  &__item-date {
    color: var(--foreground-200);
    display: block;
    margin: 0;
  }

  &__note {
    margin-top: var(--size-16);
    padding-left: var(--size-48);

    @media (max-width: 640px) {
      padding: 0;
    }
  }

  .a-pill {
    background: var(--blue-400);
    color: var(--monochrome-900);

    &--percentage {
      background: var(--blue-400);
    }
  }
}
</style>