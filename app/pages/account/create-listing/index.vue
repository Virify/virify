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
