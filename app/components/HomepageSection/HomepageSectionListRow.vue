<template>
  <li class="homepage-section-list-row">
    <h3 class="homepage-section-list-row__title | title-md">
      <AtomsIcon v-if="icon" :icon class="homepage-section-list-row__icon" aria-role="presentation" />
      {{ title }}
    </h3>

    <p class="| body-lg">{{ content }}</p>
  </li>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  content: string
}

defineProps<Props>()

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.homepage-section-list-row {
  padding: var(--size-24);
  padding-left: var(--size-56);
  max-width: 50ch;

  &__title {
    position: relative;
    font-size: var(--font-2xl);
    line-height: var(--lineheight-xs);
    margin: 0 0 var(--size-8);

    @include mq.notebook {
      font-size: var(--font-3xl);
    }

    @include mq.desktop {
      font-size: var(--font-4xl);
    }
  }

  &__icon {
    position: absolute;
    top: calc(50% - var(--size-20));
    left: calc(0px - var(--size-56));
    width: var(--size-40);
    height: var(--size-40);
    color: var(--primary-400);
  }
}
</style>