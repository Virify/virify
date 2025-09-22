<template>
  <MoleculesCardTemplate variant="basic" :result />
</template>

<script setup lang="ts">
interface Props {
  result: ListingCardData
}

defineProps<Props>()

</script>
