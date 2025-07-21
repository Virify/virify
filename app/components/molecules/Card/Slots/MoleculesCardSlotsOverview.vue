<template>
  <div role="presentation">
    <p v-if="propertyType" class="| font-semibold body-sm">
      {{ propertyType }}
    </p>

    <p v-if="fullAddress" class="| body-xs">
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