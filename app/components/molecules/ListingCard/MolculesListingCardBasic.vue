<template>
  <MoleculesListingCardBase :listing="listing" />
</template>

<script lang="ts" setup>

interface Props {
  listing: ListingCardData;
}
defineProps<Props>()
</script>