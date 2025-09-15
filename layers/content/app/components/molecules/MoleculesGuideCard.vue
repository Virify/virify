<template>
  <NuxtLink :to="to" class="guide-card">
    <div class="guide-card__top">
      <div class="guide-card__content">
        <div class="guide-card__icon">
          <AtomsIcon :icon="icon" :size="64" />
        </div>
        <h3 class="guide-card__title | title-xs">{{ title }}</h3>
      </div>
    </div>
    <div class="guide-card__description | body-sm">
      <p>{{ excerpt || description }}</p>
    </div>
    <div class="guide-card__details">
      <p v-if="readTime" class="body-xs">{{ readTime }} min read</p>
      <p v-if="publishedAt" class="body-xs">Published on {{ formatDate(publishedAt) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  to: string;
  icon?: string;
  description?: string;
  excerpt?: string;
  readTime?: number;
  isFeatured?: boolean;
  publishedAt?: string;
}>();
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;
.guide-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-xl);
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  background: var(--background-200);
  height: 100%;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
  }

  &__top {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.02)), var(--secondary-400);
    padding: var(--size-32);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    flex: 1;
    min-height: 115px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("/img/call-out-bg.svg");
      background-size: cover;
      opacity: 0.7;
      pointer-events: none;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--size-16);
    position: relative;
    z-index: 1;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-lg);

    .a-icon {
      color: var(--monochrome-100);
    }
  }

  &__title {
    color: var(--monochrome-100);
  }

  &__description {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: var(--size-16);
    color: var(--foreground-100);
    text-align: center;
    flex: 1 1 auto;
    min-height: 100px;

    @include mq.mobile-only {
      justify-content: center;
    }
  }

  &__details {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    color: var(--secondary-400);
    padding: var(--size-16);
  }
}
</style>