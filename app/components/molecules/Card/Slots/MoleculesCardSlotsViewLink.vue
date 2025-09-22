<template>
  <nuxt-link v-if="propertyId" :to="`/listing/${propertyId}/`" class="m-card-lots-view-link">
    <slot></slot>
  </nuxt-link>

  <span v-else class="m-card-lots-view-link__disabled">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  propertyId?: number
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-lots-view-link {
  text-decoration: unset;

  &__disabled {
    pointer-events: none;
  }
}
</style>