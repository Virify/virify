<template>
  <NuxtLink :to="to" class="guide-card">
    <div class="guide-card__top">
      <nuxt-img 
        v-if="image" 
        provider="sanity" 
        :src="image.asset._ref"
        :alt="imageAlt"
        :width="600" 
        :height="300"
        loading="lazy"
        class="guide-card__image"
        placeholder='/img/preload.svg'
      />  
    </div>
    <div class="guide-card__description">
      <h3 class="guide-card__title | title-xs">{{ title }}</h3>
      <p class="body-sm">{{ excerpt || description }}</p>
      <div class="guide-card__details" v-if="readTime || publishedAt">
        <AtomsPill v-if="readTime" class="body-xs">{{ readTime }} min read</AtomsPill>
        <AtomsPill v-if="publishedAt" class="body-xs">Published on {{ formatDate(publishedAt) }}</AtomsPill>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  to: string;
  image?: SanityImage;
  description?: string;
  excerpt?: string;
  readTime?: number;
  isFeatured?: boolean;
  publishedAt?: string;
}>();

// Generate descriptive alt text for SEO and accessibility
const imageAlt = computed(() => 
  props.image?.alt || `${props.title} guide cover image`
);
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
  border: 1px solid var(--monochrome-500);

  &:hover {
    transform: translateY(-4px);
  }

    &__top {
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

  &__title {
    color: var(--foreground-100);
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
    flex: 1;
    gap: var(--size-4);
    min-height: 0;

    @include mq.mobile-only {
      justify-content: flex-start;
    }
  }

  &__details {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    color: var(--foreground-200);
    padding-top: var(--size-16);
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