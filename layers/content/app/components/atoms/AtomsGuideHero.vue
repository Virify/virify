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
  <h1 class="guides-hero__title | title-2xl">{{ title }}</h1>
      <p class="guides-hero__description | r-body-md-sm">
        {{ description }}
      </p>
      <div v-if="meta?.length" class="guides-hero__meta">
        <AtomsPill
          v-for="(item, idx) in meta"
          :key="idx"
          class="guides-hero__pill | body-xs"
        >
          {{ item }}
        </AtomsPill>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  image?: SanityImage;
  meta?: string[];
}>();
</script>

<style scoped lang="scss">
@use '#styles/_utils/media' as mq;
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
    filter: brightness(0.6) contrast(1.1);
  }

  &__content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    margin-left: var(--size-32);
    padding: var(--size-24) var(--size-32);
    border-radius: var(--border-radius-md);

    @include mq.mobile-only {
      margin: 0 auto;
      padding: var(--size-16) var(--size-24);
      text-align: center;
      max-width: 100%;
    }
  }

  &__title {
    color: var(--monochrome-900);
    margin-bottom: var(--size-8);
  }

  &__description {
    color: var(--monochrome-900);
    margin-bottom: var(--size-8);
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-12);
    margin-top: var(--size-16);
    padding: var(--size-4);

    @include mq.mobile-only {
      justify-content: center;
    }
  }

  &__pill {
    background: var(--monochrome-900);
    color: var(--monochrome-200);
  }

}
</style>
