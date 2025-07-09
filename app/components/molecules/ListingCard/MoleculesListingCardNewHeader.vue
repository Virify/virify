<template>
  <h2 class="m-listing-card-header | title-sm">
    {{ formattedPrice }}
    <span class="m-listing-card-price-type | body-xs faded-text">
      {{ priceType }}
    </span>
  </h2>
</template>
<script setup lang="ts">
const props = defineProps<{
  price: number;
  priceType?: string;
}>();

const formattedPrice = computed(() => {
  return `£${parseInt(String(props.price)).toLocaleString()}`
});

const priceType = computed(() => {
  return convertEnumToString(props.priceType).toLowerCase();
});
</script>
<style lang="scss">
.m-listing-card-header {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: var(--size-8);
}

.m-listing-card-price-type {
  color: var(--monochrome-500);
  text-transform: capitalize;
}
</style>
