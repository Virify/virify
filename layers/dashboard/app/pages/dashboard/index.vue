<template>
  <h2>Home</h2>
</template>
<script lang="ts" setup>
  definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Home",
    icon: 'i-lucide-home',
  },
  layout: "dashboard",
});
</script>