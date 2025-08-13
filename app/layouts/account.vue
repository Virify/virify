<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="page">
      <div class="account-layout | container">
        <OrganismsNavigation />

        <main class="main">
          <NuxtPage />
        </main>

        <aside class="sidebar">
          <div class="sidebar-content">
            <OrganismsChatSummary />
          </div>
        </aside>
      </div>
    </div>

    <OrganismsFooter />

    <ViewsDialog />
    <MoleculesToastContainer />
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";

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
  heartbeat: {
    message: "ping",
    interval: 30000,
    pongTimeout: 5000,
  },
});

// Connect when user logs in
if (import.meta.client) {
  watch(
    () => loggedIn.value,
    (newUser) => {
      if (newUser && ws.status.value === "CLOSED") {
        ws.open();
      }
    },
    { immediate: true }
  );
}
</script>
<style lang="scss">
.page {
  min-height: calc(100vh - var(--header-expanded-height) - var(--size-16));
  background: var(--background-100);
}

.account-layout {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  background: var(--background-100);
  gap: var(--size-16);
  padding: var(--size-16);

  @media (max-width: 1200px) {
    grid-template-columns: 300px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "nav main"
      "sidebar main";

    .sidebar {
      grid-area: sidebar;
      position: static;
      height: auto;
      max-height: none;
    }

    .main {
      grid-area: main;
    }

    > :first-child {
      grid-area: nav;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-template-areas: "main";
    gap: var(--size-16);
    padding: var(--size-16);

    .sidebar {
      display: none;
    }

    .main {
      grid-area: main;
    }

    > :first-child {
      grid-area: unset;
    }
  }
}

.sidebar {
  position: sticky;
  top: calc(var(--header-offset, 0) + var(--size-16));
  height: fit-content;
  max-height: calc(100vh - var(--header-offset, 0) - var(--size-32));
  z-index: 10;
  width: auto;
  transition: width 0.3s ease;
  align-self: start;

  @media (max-width: 1200px) {
    position: static;
    top: auto;
    height: auto;
    max-height: none;
    align-self: stretch;
  }

  .sidebar-content {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    padding: var(--size-16);
    color: var(--foreground-100);
    overflow-y: auto;
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 768px) {
    gap: var(--size-16);
  }
}
</style>
