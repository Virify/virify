<template>
  <nuxt-link v-if="propertyId" :to="`/listing/${propertyId}/`" class="m-card-lots-view-link" @click="handleClick">
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

const props = defineProps<Props>()

const { trackClick } = useAnalyticsTracking()

const handleClick = () => {
  if (props.propertyId) {
    trackClick(props.propertyId)
  }
}

</script>

<style lang="scss">
.m-card-lots-view-link {
  text-decoration: unset;

  &__disabled {
    pointer-events: none;
  }
}
</style>