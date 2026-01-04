<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="account-page">
      <div class="account-layout | container">
        <!-- Left Sidebar Slot (Desktop only) -->
        <aside class="left-sidebar">
          <slot name="left-sidebar">
            <MoleculesNavigationAccountDesktop :groupStates="groupStates" @toggleGroup="toggleGroup"
              @navClick="handleNavClick" />
          </slot>
        </aside>

        <main class="main">
          <NuxtPage />
        </main>

        <!-- Bottom Navigation Slot -->
        <slot name="bottom-navigation">
          <OrganismsNavigationAccountMobile class="mobile-only-nav" />
        </slot>
      </div>
    </div>

    <OrganismsFooter class="desktop-only-footer" />

    <ViewsDialog />
    <ViewsHelpButton />
    <MoleculesToastContainer />
  </div>
</template>

<script setup lang="ts">
import { logout } from '~/utils/account/navigation'
const route = useRoute()
const groupStates = ref([true, true, true, true])

function handleNavClick(item: any) {
  if (item.action === 'logout') {
    logout()
  }
}

function toggleGroup(index: number) {
  groupStates.value[index] = !groupStates.value[index]
}


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
@use '#styles/_utils/media' as mq;
.account-page {
  background: var(--background-100);
  transition: min-height 0.25s ease;
  min-height: 100dvh;

  @include mq.menu-mobile {
    background: var(--background-200);
  }
}

.account-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-areas: "left-sidebar main";
  gap: var(--size-16);
  padding: var(--size-16) 0;
  transition: grid-template-columns 0.25s ease;

  @include mq.menu-mobile {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
    padding-bottom: calc(var(--size-16) + var(--mobile-nav-height, 0));
    min-height: calc(100vh - var(--mobile-nav-height, 0) - var(--size-16));

    .left-sidebar {
      display: none;
    }
  }
}

// Left Sidebar (Navigation)
.left-sidebar {
  grid-area: left-sidebar;
  position: sticky;
  top: calc(var(--header-height) + var(--size-16));
  height: fit-content;
  max-height: calc(100dvh - var(--header-height) - var(--size-32));
  z-index: 9;
  align-self: start;
  overflow: hidden;
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  min-width: 0;
  transition: width 0.25s ease, max-width 0.25s ease;
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

.mobile-only-nav {
  @include mq.menu-desktop {
    display: none;
  }
}

.desktop-only-footer {
  @include mq.mobile-only {
    display: none;
  }
}
</style>
