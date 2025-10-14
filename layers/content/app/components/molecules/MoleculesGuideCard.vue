<template>
  <NuxtLink :to="to" class="guide-card">
    <div class="guide-card__top">
      <nuxt-img 
        v-if="image" 
        provider="sanity" 
        :src="image.asset._ref" 
        :width="600" 
        :height="300"
        loading="lazy"
        class="guide-card__image"
        placeholder='/img/preload.svg'
      />
      <div class="guide-card__overlay"></div>
    </div>
    <div class="guide-card__description">
      <h3 class="guide-card__title | title-sm">{{ title }}</h3>
      <p class="body-sm">{{ excerpt || description }}</p>
    </div>
    <div class="guide-card__details" v-if="readTime || publishedAt">
      <p v-if="readTime" class="body-xs">{{ readTime }} min read</p>
      <p v-if="publishedAt" class="body-xs">Published on {{ formatDate(publishedAt) }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  to: string;
  image?: SanityImage;
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 200px;
    flex-shrink: 0;
    width: 100%;
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
      z-index: 0;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
  }

  &__title {
    color: var(--secondary-400);
    margin-bottom: var(--size-8);
  }

  &__description {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: var(--size-20);
    color: var(--foreground-100);
    text-align: left;
    flex: 1 1 auto;
    gap: var(--size-12);
    min-height: 0;

    @include mq.mobile-only {
      justify-content: flex-start;
    }
  }

  &__details {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    color: var(--secondary-400);
    padding: var(--size-16);
    flex-shrink: 0;

    @include mq.small-tablet {
      flex-direction: column;
      align-items: center;
      gap: var(--size-8);
    }

    @include mq.desktop {
      flex-direction: row;
      align-items: center;
      gap: 0;
    }
  }
}
</style>