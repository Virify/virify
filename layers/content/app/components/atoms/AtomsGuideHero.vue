<template>
  <section class="guides-hero">
    <nuxt-img 
      v-if="image" 
      provider="sanity" 
      :src="image.asset._ref" 
      :width="1200" 
      :height="400"
      loading="eager"
      class="guides-hero__image"
      placeholder='/img/preload.svg'
    />
    <nuxt-img 
      v-else 
      src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300&q=75" 
      class="guides-hero__image"
      placeholder='/img/preload.svg'
    />
    <div class="guides-hero__content">
      <h1 class="guides-hero__title | title-xl">{{ title }}</h1>
      <p class="guides-hero__description | body-md">
        {{ description }}
      </p>
      <div v-if="readTime || publishedAt" class="guides-hero__meta">
        <span v-if="readTime" class="guides-hero__read-time | body-xs">
          {{ readTime }} min read
        </span>
        <span v-if="publishedAt" class="guides-hero__published | body-xs">
          Published {{ formatDate(publishedAt) }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  image?: SanityImage;
  readTime?: number;
  publishedAt?: string;
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped lang="scss">
.guides-hero {
  position: relative;
  height: 400px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  overflow: hidden;

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
  }

  &__content {
    position: relative;
    z-index: 2;
    max-width: 600px;
    margin-left: var(--size-32);
    padding: var(--size-24) var(--size-32);
    background: rgba(0, 0, 0, 0.3);
    border-radius: var(--border-radius-md);
  }

  &__title {
    color: var(--monochrome-900);
    margin-bottom: var(--size-16);
  }

  &__description {
    color: var(--monochrome-900);
    margin-bottom: var(--size-16);
  }

  &__meta {
    display: flex;
    gap: var(--size-16);
    color: var(--monochrome-900);
  }

  &__read-time,
  &__published {
    opacity: 0.9;
  }
}
</style>
