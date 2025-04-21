<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="page">
      <NuxtPage />
    </div>

    <OrganismsFooter />
  </div>
</template>

<script setup>
useServerSeoMeta({
  title: 'Virify | Welcome',
  description: 'New website coming soon...'
})

useHead({
  htmlAttrs: {
    lang: 'en-GB',
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: true
    },
    {
      rel: 'preload',
      as: 'style',
      href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;600;700&display=swap',
      onload: 'this.onload=null; this.rel="stylesheet"'
    }
  ]
})
</script>

<style>
/*
 *  Temporary spacing just until proper page styling is implemented
 */
.page {
  margin: var(--size-32) auto;
}
</style>