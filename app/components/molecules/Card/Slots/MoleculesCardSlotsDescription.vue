<template>
  <p class="m-card-slots-description | body-xs">
    {{ description }}
  </p>
</template>

<script setup lang="ts">
interface Props {
  description: string
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-slots-description {
  margin: var(--size-8) 0 var(--size-16);
  line-height: var(--lineheight-md);
  max-height: calc(3 * var(--lineheight-md));
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>