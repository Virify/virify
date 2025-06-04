<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="page">
      <NuxtPage />
    </div>

    <!-- <OrganismsFooter /> -->

    <ViewsDialog />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";

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
      crossorigin: 'anonymous'
    },
    {
      rel: 'preload',
      as: 'style',
      href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;600;700&display=swap',
      onload: 'this.onload=null; this.rel="stylesheet"'
    }
  ]
})

// Global WebSocket connection - establish connection when user logs in
const config = useRuntimeConfig();
const { user } = useUserSession();

if (import.meta.client) {
  // Connect to WebSocket when user is authenticated
  watch(() => user.value, (newUser) => {
    if (newUser) {
      useWebSocket(config.public.WS_BASE_URL + "/api/_ws/conversation", {
        autoConnect: true,
        immediate: true,
        autoClose: false,
        autoReconnect: {
          retries: 3,
          delay: 1000,
          onFailed() {
            console.warn("Failed to reconnect WebSocket after 3 attempts.");
          },
        },
      });
      console.log("WebSocket connection established in default layout");
    }
  }, { immediate: true });
}
</script>

<style>
/*
 *  Temporary spacing just until proper page styling is implemented
 */
.page {
  margin: var(--size-32) auto;
}
</style>