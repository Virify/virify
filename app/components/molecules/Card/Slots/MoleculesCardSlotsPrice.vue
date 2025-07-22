<template>
  <h3 class="m-cards-slots-price | title-sm">
    {{ price }}

    <span v-if="priceGuide" class="m-cards-slots-price__pill | font-medium body-xs">
      {{ priceGuide }}
    </span>
  </h3>
</template>

<script setup lang="ts">
interface Props {
  price: string
  priceGuide?: string
}

defineProps<Props>()

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-cards-slots-price {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: var(--size-4);
  column-gap: var(--size-10);

  &__pill {
    display: flex;
    align-items: center;
    font-weight: var(--font-semibold);
    padding: var(--size-4) var(--size-12);
    line-height: var(--lineheight-xs);
    background: var(--card-background-pill);
    border: 1px solid var(--card-border-colour);
    border-radius: var(--border-radius-pill);
    white-space: nowrap;
  }
}
</style>