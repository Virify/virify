<template>
  <div>
    <NuxtLoadingIndicator />
    <OrganismsHeader />

    <div class="page">
      <div class="account-layout | container" :class="{ 'account-layout--messages-expanded': isExpanded }">
        <OrganismsNavigation />

        <main class="main">
          <NuxtPage />
        </main>

        <aside class="sidebar" v-if="showSidebar">
          <div class="sidebar-content sidebar-content--enquiries" :class="{ 'sidebar-content--collapsed': isCollapsed, 'sidebar-content--has-overlay': selectedConversation !== null }">
            <OrganismsChatSummary 
              v-show="selectedConversation === null"
              :limit="0" 
              :search-enabled="true" 
              :disable-navigate="true"
              :sort="true"
              @select-conversation="handleConversationSelect"
              @toggle-collapsed="isCollapsed = $event"
            />
            
            <div v-show="selectedConversation !== null" class="sidebar-overlay">
              <OrganismsEnquiryDetail 
                :is-open="selectedConversation !== null"
                :conversation="selectedConversation"
                :current-user-id="user?.id"
                @back="selectedConversation = null"
              />
            </div>
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
const selectedConversation = ref<ConversationWithUserAndMessages | null>(null);
const isCollapsed = ref(false);
const route = useRoute();

const isMessagesPage = computed(() => {
  return route.path === '/account/messages';
});

// Control sidebar visibility with transition timing
const showSidebar = ref(true);
const isExpanded = ref(false);

// Watch route changes and control transition timing
watch(() => route.path, (newPath, oldPath) => {
  const newIsMessages = newPath === '/account/messages';
  const oldIsMessages = oldPath === '/account/messages';
  
  if (newIsMessages !== oldIsMessages) {
    if (newIsMessages) {
      // Going TO messages - hide sidebar after a delay to let page transition start
      setTimeout(() => {
        showSidebar.value = false;
        isExpanded.value = true;
      }, 250); // Start during page fade out
    } else {
      // Going FROM messages - show sidebar immediately when page starts transitioning
      showSidebar.value = true;
      isExpanded.value = false;
    }
  }
});

// Initialize on mount
onMounted(() => {
  showSidebar.value = route.path !== '/account/messages';
  isExpanded.value = route.path === '/account/messages';
});


function handleConversationSelect(conversation: ConversationWithUserAndMessages) {
  selectedConversation.value = conversation;
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


const { user } = useUserSession();

</script>
<style lang="scss">
@use '#styles/_utils/media' as mq;
.page {
  background: var(--background-100);
  min-height: 100vh;
  transition: min-height 0.25s ease;
}

.account-layout {
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: var(--size-16);
  padding: var(--size-16);
  transition: grid-template-columns 0.25s ease;
  
  &:has(.sidebar-content--has-overlay) {
    grid-template-columns: 300px 1fr 400px;
  }
  
  &.account-layout--messages-expanded {
    grid-template-columns: 300px 1fr;
  }

  @include mq.not-notebook {
    grid-template-columns: 300px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas:
      "nav main"
      "sidebar main";

    &:has(.sidebar-content--has-overlay) {
      grid-template-columns: 300px 1fr;
      grid-template-areas:
        "nav sidebar"
        "sidebar sidebar";
    }

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

  @include mq.mobile-only {
    grid-template-columns: 1fr;
    grid-template-areas: "main";

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
  bottom: var(--size-16);
  height: fit-content;
  max-height: calc(100vh - var(--header-offset, 0) - var(--size-48));
  z-index: 10;
  width: auto;
  transition: all 0.3s ease;
  align-self: start;
  padding-bottom: var(--size-4);
  

  @include mq.not-notebook {
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
    color: var(--foreground-100);
    overflow-y: auto;
    position: relative;
    
    @include mq.mobile-only {
      padding: 0;
    }

    &--enquiries {
      padding: 0;
      
      &.sidebar-content--has-overlay {
        height: calc(100vh - var(--header-expanded-height) + var(--size-32));
        
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
  overflow: hidden;
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
