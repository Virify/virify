<template>
  <NuxtLoadingIndicator />
  <OrganismsHeader />

  <div class="page">
    <NuxtPage />
  </div>

  <OrganismsFooter />

  <ViewsDialog />
  <MoleculesToastContainer />
</template>

<script setup lang="ts">
// Handle authentication dialog logic
useAuthenticationHandler();

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
      as: "image",
      href: "/img/preload.svg",
    },
  ],
});
</script>
<style lang="scss">
.page {
  background: var(--background-100);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

.page-enter-to,
.page-leave-from {
  opacity: 1;
}
</style>
