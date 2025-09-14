<template>
  <h1>Create a Listing</h1>
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