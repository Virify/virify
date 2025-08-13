<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="page">
      <NuxtPage />
    </div>

    <OrganismsFooter />

    <ViewsDialog />
    <MoleculesToastContainer />
  </div>
</template>

<script setup lang="ts">

useHead({
  htmlAttrs: {
    lang: "en-GB",
  },
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
    {
      rel: "preload",
      as: "style",
      href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;600;700&display=swap",
      onload: 'this.onload=null; this.rel="stylesheet"',
    },
    {
      rel: "preload",
      as: 'image',
      href: "/img/preload.svg",
    },
  ],
});
</script>
<style lang="scss">
.page {
  min-height: calc(100vh - var(--header-expanded-height) - var(--size-16));
  background: var(--background-100);
}
</style>