<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="account-page">
      <div class="account-layout container" :class="{ 'account-layout--messages-expanded': isExpanded }">
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

        <!-- Right Sidebar Slot -->
        <aside class="right-sidebar" v-if="showSidebar">
          <slot name="right-sidebar">
            <OrganismsConversationSidebar />
          </slot>
        </aside>


        <!-- Bottom Navigation Slot -->
        <slot name="bottom-navigation">
          <OrganismsNavigationAccountMobile class="mobile-only-nav" />
        </slot>
      </div>
    </div>

    <OrganismsFooter class="desktop-only-footer" />

    <ViewsDialog />
    <MoleculesToastContainer />
  </div>
</template>

<script setup lang="ts">
import { logout } from '~/utils/account/navigation'
const route = useRoute()
const groupStates = ref([true, true, true, false])

// Control sidebar visibility
const showSidebar = computed(() =>
  route.path !== '/account/messages'
)
const isExpanded = computed(() =>
  route.path === '/account/messages'
)

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
  min-height: 100vh;
}

.account-layout {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  grid-template-areas: "left-sidebar main right-sidebar";
  gap: var(--size-16);
  padding: var(--size-16);
  transition: grid-template-columns 0.25s ease;

  &:has(.sidebar-content--has-overlay) {
    grid-template-columns: 300px 1fr 400px;
  }

  &.account-layout--messages-expanded {
    grid-template-columns: 300px 1fr;
    grid-template-areas: "left-sidebar main";

    @include mq.mobile-only {
      grid-template-columns: 1fr;
      grid-template-areas: "main";
      padding: 0;
      overflow: visible;
    }
  }

  @include mq.not-notebook {
    grid-template-columns: 300px 1fr;
    grid-template-areas: "left-sidebar main";

    .right-sidebar {
      display: none;
    }
  }

  @include mq.mobile-only {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
    padding-bottom: calc(var(--size-16) + var(--mobile-nav-height, 0));
    min-height: calc(100vh - var(--mobile-nav-height, 0) - var(--size-16));

    .left-sidebar,
    .right-sidebar {
      display: none;
    }
  }
}

// Left Sidebar (Navigation)
.left-sidebar {
  grid-area: left-sidebar;
  position: sticky;
  bottom: var(--size-16);
  height: fit-content;
  max-height: calc(100svh - var(--header-height) - var(--size-48));
  z-index: 10;
  align-self: start;
  overflow: hidden;
  padding-top: var(--header-height);
}

// Right Sidebar (Conversations)  
.right-sidebar {
  grid-area: right-sidebar;
  position: sticky;
  bottom: var(--size-16);
  height: fit-content;
  max-height: calc(100svh - var(--header-height) - var(--size-48));
  z-index: 10;
  align-self: start;
  padding-top: var(--header-height);


  @include mq.not-notebook {
    position: static;
    top: auto;
    height: auto;
    max-height: none;
    align-self: stretch;
  }

  @include mq.mobile-only {
      padding: 0;
      display: none;
    }

  .sidebar-content {
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    color: var(--foreground-100);
    position: relative;

    @include mq.mobile-only {
      padding: 0;
      display: none;
    }

    &--conversations {
      padding: 0;
      overflow-y: auto;
      min-height: 70vh;
      height: var(--navigation-sidebar-height, fit-content);
      box-sizing: border-box;
      transition: height ease;

      &.sidebar-content--has-overlay {
        height: var(--navigation-sidebar-height, fit-content);

        @include mq.tablet-only {
          height: 60vh;
        }
      }

    }
  }

  .sidebar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    border-radius: var(--border-radius-xl);
    overflow: hidden;
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
  transition: width 0.25s ease, max-width 0.25s ease;
  padding-top: var(--header-height)  // Allow children to manage their own scroll/clipping; required for position: sticky
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
  @include mq.tablet {
    display: none;
  }
}

.desktop-only-footer {
  @include mq.mobile-only {
    display: none;
  }
}
</style>
