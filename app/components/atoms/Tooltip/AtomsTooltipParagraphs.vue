<template>
  <div class="a-tooltip-paragraphs">
    <p 
      v-for="(paragraph, index) in paragraphs" 
      :key="index"
      class="body-xs"
      :class="{ 'a-tooltip-paragraphs__paragraph--spaced': index > 0 }"
    >
      {{ paragraph }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  paragraphs: string[];
}>();
</script>

<style lang="scss">
.a-tooltip-paragraphs {
  &__paragraph {
    &--spaced {
      margin-top: var(--size-12);
    }
  }
}
</style>