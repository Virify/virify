<template>
  <div role="presentation" class="o-searchform-title-block | flow flow-md" :class="{
    'o-searchform-title-block-background': hasBackground
  }">
    <h2 v-if="title" :class="{
      '| title-xs': !titleLarge,
      '| title-md': titleLarge,
    }">{{ title }}</h2>

    <OrganismsSearchFormGrid v-if="hasGrid">
      <slot></slot>
    </OrganismsSearchFormGrid>

    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  titleLarge?: boolean
  hasBackground?: boolean
  hasGrid?: boolean
}

withDefaults(defineProps<Props>(), {
  titleLarge: false,
  hasBackground: false,
  hasGrid: false
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-searchform-title-block {

  &-background {
    padding: var(--popover-padding);
    background: var(--background-100);
    border-radius: var(--border-radius-lg);

    @include mq.small-tablet {
      border-radius: var(--border-radius-xl);
    }

    @include mq.tablet {
      border-radius: var(--border-radius-2xl);
    }
  }
}
</style>