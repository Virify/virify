<template>
  <NuxtLink :to="to" class="guide-card">
    <div class="guide-card__top" :class="{ 'has-image': heroImage }">
      <div class="guide-card__content">
        <div class="guide-card__icon">
          <AtomsIcon :icon="icon" :size="64" />
        </div>
        <h3 class="guide-card__title | r-title-sm">{{ title }}</h3>
      </div>
        <p v-if="readTime" class="guide-card__read-time | body-xs">{{ readTime }} min read</p>
    </div>
    <div class="guide-card__description | body-sm">
      {{ excerpt || description }}
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
  heroImage?: string;
  imageAlt?: string;
}>();
</script>

<style scoped lang="scss">
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
  width: 350px;

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
    margin: 0;
  }

  &__description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--size-24);
    color: var(--foreground-100);
    text-align: center;
    flex-grow: 1;
    margin: 0;
  }

  &__read-time {
    position: absolute;
    top: 0;
    left: 0;
    padding: var(--size-16);
    color: var(--background-100);
  }
}
</style>