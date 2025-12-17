<template>
  <h3 class="m-cards-slots-price | title-sm">
    {{ price }}

    <div class="m-cards-slots-price__pills">
      <span v-if="listingType" class="m-cards-slots-price__pill | font-medium body-xs">
        {{ listingType }}
      </span>
      
      <span v-if="priceGuide" class="m-cards-slots-price__pill | font-medium body-xs">
        {{ priceGuide }}
      </span>
    </div>
  </h3>
</template>

<script setup lang="ts">
interface Props {
  price: string
  priceGuide?: string
  listingType?: string
}

defineProps<Props>()

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-cards-slots-price {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-6);

  &__pills {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    flex-wrap: nowrap;
  }

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