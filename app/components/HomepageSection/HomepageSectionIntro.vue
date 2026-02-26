<template>
  <div class="homepage-section-intro | flow flow-lg" aria-role="presentation">
    <h2 class="homepage-section-intro__title | title-xl">
      {{ title }}
    </h2>

    <p class="homepage-section-intro__overview | body-lg">
      {{ description }}
    </p>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

defineProps<Props>()
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-intro {

  &__title {
    font-size: var(--font-6xl);
    width: min(100%, 12ch);
    line-height: var(--lineheight-xs);
    margin: 0 0 var(--size-32);

    @include mq.notebook {
      font-size: var(--font-7xl);
    }

    @include mq.desktop {
      font-size: var(--font-8xl);
    }
  }
}
</style>