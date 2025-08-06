<template>
  <div class="dashboard | container">
    <aside class="sidebar">
      <div class="sidebar-content">
        <slot name="navigation">
          <div class="navigation">
            <div class="nav-container">
              <!-- All navigation items -->
              <template v-for="(group, groupIndex) in navigationGroups" :key="group.title">
                <!-- Group header -->
                <div class="icon-cell">
                  <div class="icon-btn" @click="toggleGroup(groupIndex)">
                    <AtomsIcon :icon="group.icon" size="32" />
                  </div>
                </div>
                <div class="text-cell group-header body-md" @click="toggleGroup(groupIndex)">
                  <span>{{ group.title }}</span>
                  <AtomsIcon :icon="groupStates[groupIndex] ? 'chevron-up' : 'chevron-down'" size="16" />
                </div>

                <!-- Group items with accordion animation -->
                <template v-for="(item, itemIndex) in group.items" :key="item.name">
                  <div v-show="groupStates[groupIndex]" class="icon-cell group-item">
                    <NuxtLink :to="item.url" class="icon-btn" @click="handleNavClick(item)">
                      <AtomsIcon :icon="item.icon" size="22" />
                    </NuxtLink>
                  </div>
                  <div v-show="groupStates[groupIndex]" class="text-cell group-item body-sm">
                    <NuxtLink :to="item.url" @click="handleNavClick(item)">
                      {{ item.name }}
                    </NuxtLink>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </slot>
      </div>
    </aside>

    <main class="main">
      <div class="analytics-section">
        <slot name="analytics">
          <AtomsStatsCard :value="String(analytics?.totalViews || 0)"
            :subtitle="`+${analytics?.percentageChange || 0}% from last month`" title="Total Listings Views"
            :animated="true" />
          <AtomsStatsCard :value="String(analytics?.favoritedByOthersCount || 0)" subtitle="Listings saved by users"
            title="Listings Favourited" :animated="true" />
          <AtomsStatsCard :value="String(analytics?.totalConversations || 0)" subtitle="Enquiries on your listings"
            title="Total Enquiries" :animated="true" />
        </slot>
      </div>

      <div class="content-section">
        <slot name="content">
          <OrganismsRecentCard :is-collapsed="isViewedCollapsed" @toggle="isViewedCollapsed = !isViewedCollapsed"
            title="Recently Viewed Listings" icon="search" :items="recentlyViewedListings" variant="blue"
            icon-name="search" empty-message="No recent views yet." />
        </slot>
      </div>

      <div class="content-section">
        <slot name="content">
          <OrganismsRecentCard :is-collapsed="isFavouritesCollapsed"
            @toggle="isFavouritesCollapsed = !isFavouritesCollapsed" title="Recently Favourited Listings"
            icon="cards/favourite" :items="recentFavourites" variant="secondary" icon-name="cards/favourite-filled"
            empty-message="No recent favourites yet." />
        </slot>
      </div>

      <div class="content-section">
        <slot name="content">
          <OrganismsRecentCard :is-collapsed="isNotesCollapsed" @toggle="isNotesCollapsed = !isNotesCollapsed"
            title="Recently Added Notes" icon="cards/notes" :items="recentUserNotes" variant="blue"
            icon-name="cards/notes" :has-background-image="true" empty-message="No recent notes yet." />
        </slot>
      </div>

      <div class="actions-section">
        <slot name="actions"></slot>
      </div>
    </main>

    <aside class="sidebar">
      <div class="sidebar-content">
        <slot name="chat">
          Chat
        </slot>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { navigationGroups } from '~/utils/account/navigation';

definePageMeta({
  middleware: ["authenticated"],
  head: {
    title: "Dashboard v2",
  },
});

const { analytics, recentFavourites, recentUserNotes, recentlyViewedListings } = useAnalytics();

const isViewedCollapsed = ref(false);
const isFavouritesCollapsed = ref(true);
const isNotesCollapsed = ref(true);

// Remove hover expansion - sidebar always expanded

// Group accordion states - start with first group open
const groupStates = ref([true, false, false]);

function toggleGroup(index: number) {
  groupStates.value[index] = !groupStates.value[index];
}

function handleNavClick(item: any) {
  if (item.action === 'logout') {
    // Handle logout action
    console.log('Logout clicked');
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  display: grid;
  grid-template-columns: auto 3fr 1fr;
  background: var(--background-100);
  gap: var(--size-16);
  padding: var(--size-16);
  min-height: calc(100vh - var(--header-offset) - var(--size-32));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}

.sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--size-16));
  height: fit-content;
  max-height: calc(100vh - var(--header-height) - var(--size-32) - var(--size-16));
  z-index: 10;
  width: auto;
  min-width: fit-content;
  transition: width 0.3s ease;

  &.collapsed {
    width: fit-content;
  }
}

.sidebar-content {
  background: var(--blue-400);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  min-width: fit-content;
  max-height: calc(100vh - var(--header-height) - var(--size-32) - var(--size-16));
  overflow-y: auto;
}

.navigation {
  padding: var(--size-16);

  .nav-container {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0;


    .icon-cell {
      background: var(--secondary-400);
      display: flex;
      align-items: center;
      justify-content: center;

      &:first-child {
        border-top-left-radius: var(--border-radius-xl);
        border-top-right-radius: var(--border-radius-xl);
      }

      &:nth-last-child(2) {
        border-bottom-left-radius: var(--border-radius-xl);
        border-bottom-right-radius: var(--border-radius-xl);
      }

      &:nth-last-child(5) {
        border-bottom-left-radius: var(--border-radius-xl);
        border-bottom-right-radius: var(--border-radius-xl);
      }

      .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--size-12) var(--size-16);
        cursor: pointer;
        transition: opacity 0.2s ease;
        text-decoration: none;
        color: inherit;
        width: 100%;

        &:hover {
          opacity: 0.8;
        }

        :deep(svg) {
          color: white;
        }
      }

      // Make group header icons larger
      &.group-header-icon {
        .icon-btn {
          :deep(svg) {
            width: 32px;
            height: 32px;
          }
        }
      }
    }

    .text-cell {
      background: var(--blue-400);
      display: flex;
      align-items: center;
      padding: 0 var(--size-16);
      color: var(--monochrome-900);
      font-weight: 500;

      &.group-header {
        font-weight: 600;
      }

      &.group-header {
        font-weight: 600;
        cursor: pointer;
        justify-content: space-between;
        transition: background 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        :deep(svg) {
          width: 16px;
          height: 16px;
        }
      }

      &.group-item {
        transition: all 0.3s ease;
        transform-origin: top;
      }

      a {
        color: inherit;
        padding: 0 var(--size-8);
        text-decoration: none;
        border-radius: var(--border-radius-md);
        transition: background 0.2s ease;
        width: 100%;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }

    // Accordion animation for group items
    .icon-cell.group-item {
      transition: all 0.3s ease;
      transform-origin: top;
    }
  }
}

.main {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  @media (max-width: 768px) {
    gap: 1rem;
  }
}

.analytics-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.content-section {
  background: var(--background-200);
  padding: var(--size-32);
  border-radius: var(--border-radius-xl);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
}

.actions-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
