<template>
  <MoleculesCardTemplate variant="featured" :result />
</template>

<script setup lang="ts">
interface Props {
  result: ListingCardData
}

defineProps<Props>()

</script>