<template>
  <MoleculesCarousel v-if="guides && guides.length > 0" :slides="guides" :slide-size="'350px'" :gap="'var(--size-24)'" :loop="true" :show-arrows="true">
    <template #default="{ slide }">
      <NuxtLink :to="`/guides/${slide.category?.slug?.current}/${slide.slug.current}`" class="guides-carousel__link">
        <div class="guides-carousel__guide">
          <div class="guides-carousel__guide--img">
            <NuxtImg :src="slide.heroImage?.asset._ref" :alt="slide.heroImage?.asset.alt || slide.title || 'Guide Image'" :width="300" :height="200" :object-fit="'cover'" provider="sanity" placeholder="/img/preload.svg" />
            <AtomsPill v-if="slide.category?.title" variant="secondary" size="sm" class="guides-carousel__guide--category">
              {{ slide.category.title }}
            </AtomsPill>
            <AtomsPill v-if="slide.readTime" variant="primary" size="sm" class="guides-carousel__guide--read-time"> {{ slide.readTime }} min read </AtomsPill>
          </div>
          <h2 class="title-xs">{{ slide.title }}</h2>
          <p class="body-sm">{{ slide.excerpt }}</p>
        </div>
      </NuxtLink>
    </template>
  </MoleculesCarousel>
</template>

<script setup lang="ts">
interface Props {
  guides?: Guide[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.guides-carousel {
  &__link {
    text-decoration: none;
    color: inherit;
  }

  &__guide {
    display: flex;
    flex-direction: column;
    height: 100%;

    &--img {
      box-sizing: border-box;
      border-radius: var(--border-radius-2xl);
      overflow: hidden;
      width: 100%;
      height: 200px;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
    }

    &--category {
      position: absolute;
      top: var(--size-12);
      left: var(--size-12);
    }

    &--read-time {
      position: absolute;
      bottom: var(--size-12);
      right: var(--size-12);
    }

    h2 {
      margin-top: var(--size-16);
      margin-bottom: var(--size-8);
    }

    p {
      margin: 0;
    }
  }
}
</style>
