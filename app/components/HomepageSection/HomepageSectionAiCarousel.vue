<template>
  <ul class="homepage-section-ai-carousel">
    <li v-for="{ title, content, icon } of sections" :key="title" class="homepage-section-ai-carousel__slide">
      <h3 class="homepage-section-ai-carousel__slide-title | title-lg">
        <AtomsIcon v-if="icon" :icon class="homepage-section-ai-carousel__slide-title-icon" aria-role="presentation" />
        {{ title }}
      </h3>

      <p class="homepage-section-ai-carousel__slide-content | body-lg">
        {{ content }}
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface CarouselSection extends Record<any, any> {
  icon?: string
  title: string
  content: string
}

interface Props {
  sections: CarouselSection[]
}

defineProps<Props>()
</script>

<style lang="scss">
.homepage-section-ai-carousel {

  &__slide {
    padding: var(--size-24);
    padding-left: var(--size-56);
  }

  &__slide-title {
    position: relative;
    font-size: var(--font-2xl);
    line-height: var(--lineheight-sm);
  }

  &__slide-title-icon {
    position: absolute;
    top: calc(50% - var(--size-20));
    left: calc(0px - var(--size-56));
    width: var(--size-40);
    height: var(--size-40);
    color: var(--secondary-400);
  }
}
</style>