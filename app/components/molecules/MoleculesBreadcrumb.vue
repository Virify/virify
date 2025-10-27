<template>
  <nav :class="['breadcrumb', variant && `breadcrumb--${variant}`]">
    <template v-for="(item, index) in items" :key="index">
      <AtomsPill v-if="item.to" class="breadcrumb__item">
        <NuxtLink :to="item.to" class="breadcrumb__link | body-sm">
          {{ item.label }}
        </NuxtLink>
      </AtomsPill>
      <AtomsPill v-else class="breadcrumb__item breadcrumb__item--current | body-sm" aria-current="page">
        {{ item.label }}
      </AtomsPill>

      <span v-if="index < items.length - 1" class="breadcrumb__separator">
        /
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{
  items: BreadcrumbItem[]
  variant?: 'default' | 'blue'
}>()
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  padding: var(--size-16) 0 var(--size-16) 0;
  flex-wrap: wrap;

  @include mq.mobile-only {
    padding: var(--size-8) 0 var(--size-8) 0;
  }

  &__item {
    background: var(--background-200);
    color: var(--foreground-100);
    border: 1px solid var(--secondary-400);
    transition: background 0.2s ease, color 0.2s ease;

    &--current {
      background: var(--secondary-400);
      color: var(--monochrome-900);
      border: 1px solid var(--foreground-200);
    }

    &:hover {
      background: var(--secondary-400);
      color: var(--foreground-100);
    }
  }

  &__link {
    color: inherit;
    text-decoration: none;
  }

  &__separator {
    color: var(--secondary-400);
  }

  // Blue variant modifier
  &--blue {
    .breadcrumb__item {
      border-color: var(--blue-400);
      border-color: var(--foreground-100);

      &--current {
        background: var(--blue-400);
        color: var(--monochrome-900);
        border-color: var(--foreground-200);
      }

      &:hover {
        background: var(--blue-400);
        color: var(--monochrome-900);
      }
    }

    .breadcrumb__separator {
      color: var(--blue-400);
    }
  }
}
</style>