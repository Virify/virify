<template>
  <OrganismsAccountCreateListingHero />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Create a Listing",
  },
  layout: "account",
});
</script>
<style lang="scss">
.create-listing__info {
  padding: var(--size-16);
}
</style>
