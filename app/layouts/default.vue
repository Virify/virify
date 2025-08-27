<template>
  <div class="default-layout" :style="layoutStyle">
    <NuxtLoadingIndicator />
    <OrganismsHeader ref="headerRef" />

    <div class="page">
      <NuxtPage />
    </div>

    <OrganismsFooter />

    <ViewsDialog />
    <MoleculesToastContainer />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver, useScreenSafeArea } from '@vueuse/core';

// Handle authentication dialog logic
useAuthenticationHandler();

const headerRef = ref<HTMLElement | null>(null);
const headerHeight = ref(0);

useResizeObserver(headerRef, (entries) => {
  const entry = entries[0]!;
  headerHeight.value = entry.contentRect.height;
});

const { top, bottom } = useScreenSafeArea();

const layoutStyle = computed(() => ({
  '--header-height-actual': `${headerHeight.value}px`,
  '--safe-area-inset-top': top.value,
  '--safe-area-inset-bottom': bottom.value,
}));

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
.default-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
}

.page {
  background: var(--background-100);
  flex-grow: 1;
  padding-top: var(--header-height-actual);
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