<template>
  <div class="p-search-redirect">
    <p>Redirecting...</p>
  </div>
</template>

<script setup lang="ts">
/**
 * Redirect /search to home page
 * 
 * Search now requires URL params: /search/{location}/{radius}/{prompt}
 * If someone lands on /search without params, redirect them to start a search
 */
definePageMeta({
  middleware: () => navigateTo('/', { redirectCode: 302 })
})
</script>

<style lang="scss">
.p-search-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--header-height));
}
</style>
