<template>
  <h3 v-if="title" class="m-autocomplete-popover-title | title-3xs faded-text">{{ title }}</h3>

  <slot />
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<style>
.m-autocomplete-popover-title {
  margin-bottom: var(--size-16);
}
</style>