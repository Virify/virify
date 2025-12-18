<template>
  <nav :class="['breadcrumb', variant && `breadcrumb--${variant}`]">
    <template v-for="(item, index) in items" :key="index">
      <p v-if="item.to" class="breadcrumb__item">
        <NuxtLink :to="item.to" class="breadcrumb__link | r-body-md-sm">
          {{ item.label }}
        </NuxtLink>
      </p>
      <p v-else class="breadcrumb__item breadcrumb__item--current | r-body-md-sm" aria-current="page">
        {{ item.label }}
      </p>

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

  &__link {
    color: inherit;
    text-decoration: none;
  }

  &__separator {
    color: var(--secondary-400);
  }

  &__item {
    &--current {
      font-weight: var(--font-semibold);
    }
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