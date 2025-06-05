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
  title: "Virify | Welcome",
  description: "New website coming soon...",
});

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
  ],
});

// Global WebSocket connection - establish connection when user logs in
const config = useRuntimeConfig();
const { loggedIn } = useUserSession();

const ws = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection", {
  autoConnect: false,
  immediate: false,
  autoClose: false,
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      console.warn("Failed to reconnect WebSocket after 3 attempts.");
    },
  },
});

// Connect when user logs in
if (import.meta.client) {
  watch(
    () => loggedIn.value,
    (newUser) => {
      if (newUser && ws.status.value === "CLOSED") {
        ws.open();
        console.log("WebSocket connection established in default layout");
      }
    },
    { immediate: true }
  );
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
