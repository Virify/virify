<template>
  <div role="presentation">
    <p v-if="propertyType" class="m-card-slots-overview__type | font-semibold body-sm">
      {{ propertyType }}
    </p>

    <p v-if="fullAddress" class="m-card-slots-overview__address | body-xs">
      {{ fullAddress }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  propertyType?: string | null
  fullAddress?: string | null
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-slots-overview {

  &__type {
    line-height: var(--lineheight-sm);
    margin-bottom: var(--size-4);
  }

  &__address {
    margin-bottom: var(--size-12);
  }
}
</style>