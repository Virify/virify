<template>
  <UDashboardPanel id="admin-overview-panel">
    <template #header>
      <UDashboardNavbar title="Admin Overview" toggle-side="left" class="border-0" :ui="{ title: 'title-sm m-0!' }" />
    </template>
    <template #body>
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 12" :key="i" class="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </template>

      <template v-else-if="data">
        <!-- Users -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Users
          <UIcon name="i-lucide-users" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Total Users" :description="fmt(data.totalUsers)" icon="i-lucide-users" :ui="cardUi" />
          <UPageCard title="Active Today" :description="fmt(data.activeUsersToday)" icon="i-lucide-activity" :ui="cardUi" />
          <UPageCard title="Active This Week" :description="fmt(data.activeUsersThisWeek)" icon="i-lucide-calendar" :ui="cardUi" />
          <UPageCard title="Active This Month" :description="fmt(data.activeUsersThisMonth)" icon="i-lucide-calendar-days" :ui="cardUi" />
          <UPageCard title="New This Week" :description="fmt(data.newUsersThisWeek)" icon="i-lucide-user-plus" :ui="cardUi" />
          <UPageCard title="New This Month" :description="fmt(data.newUsersThisMonth)" icon="i-lucide-user-check" :ui="cardUi" />
          <UPageCard title="Have Listings" :description="fmt(data.usersWithListings)" icon="i-lucide-home" :ui="cardUi" />
          <UPageCard title="Have Favourites" :description="fmt(data.usersWithFavourites)" icon="i-lucide-heart" :ui="cardUi" />
        </div>

        <!-- Listings -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Listings
          <UIcon name="i-lucide-home" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Published" :description="fmt(data.totalPublishedListings)" icon="i-lucide-globe" :ui="cardUi" />
          <UPageCard title="Drafts" :description="fmt(data.totalDraftListings)" icon="i-lucide-file-edit" :ui="cardUi" />
          <UPageCard title="Archived" :description="fmt(data.totalArchivedListings)" icon="i-lucide-archive" :ui="cardUi" />
          <UPageCard title="Hidden by Buyers" :description="fmt(data.usersWithHiddenListings)" icon="i-lucide-eye-off" :ui="cardUi" />
        </div>

        <!-- Activity -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Platform Activity
          <UIcon name="i-lucide-bar-chart-3" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Total Searches" :description="fmt(data.totalSearchesRun)" icon="i-lucide-search" :ui="cardUi" />
          <UPageCard title="Mortgage Calcs" :description="fmt(data.totalMortgageCalculations)" icon="i-lucide-calculator" :ui="cardUi" />
          <UPageCard title="Conversations" :description="fmt(data.totalConversations)" icon="i-lucide-message-square" :ui="cardUi" />
          <UPageCard title="Messages" :description="fmt(data.totalMessages)" icon="i-lucide-messages-square" :ui="cardUi" />
          <UPageCard title="Listing Views" :description="fmt(data.totalListingViews)" icon="i-lucide-eye" :ui="cardUi" />
          <UPageCard title="Impressions" :description="fmt(data.totalListingImpressions)" icon="i-lucide-monitor" :ui="cardUi" />
          <UPageCard title="Clicks" :description="fmt(data.totalListingClicks)" icon="i-lucide-mouse-pointer-click" :ui="cardUi" />
          <UPageCard title="Shares" :description="fmt(data.totalListingShares)" icon="i-lucide-share-2" :ui="cardUi" />
        </div>
      </template>
    </template>
  </UDashboardPanel>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["admin"],
  layout: "admin",
});

const { data, status } = await useAsyncData("admin-overview", () =>
  useRequestFetch()("/api/admin/overview"),
);

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-GB");

const cardUi = {
  root: "ring-1 ring-default",
  description: "title-sm font-bold text-foreground",
  leadingIcon: "text-secondary",
};
</script>
