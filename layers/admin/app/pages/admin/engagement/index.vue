<template>
  <UDashboardPanel id="admin-engagement-panel">
    <template #header>
      <UDashboardNavbar title="Engagement Analytics" toggle-side="left" class="border-0" :ui="{ title: 'title-sm m-0!' }" />
    </template>
    <template #body>
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </template>

      <template v-else-if="data">
        <!-- Site page views -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Site Page Views
          <UIcon name="i-lucide-file-chart-column" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Total Page Views" :description="fmt(data.pageViews.total)" icon="i-lucide-file-chart-column" :ui="cardUi" />
          <UPageCard title="Authenticated" :description="fmt(data.pageViews.authenticated)" icon="i-lucide-user" :ui="cardUi" />
          <UPageCard title="Anonymous" :description="fmt(data.pageViews.anonymous)" icon="i-lucide-user-x" :ui="cardUi" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top Pages
              <UIcon name="i-lucide-list-ordered" class="text-secondary" />
            </h2>
            <UTable :data="data.topPages" :columns="[{ accessorKey: 'path', header: 'Path' }, { accessorKey: 'views', header: 'Views' }]" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Page View Sources
              <UIcon name="i-lucide-globe" class="text-secondary" />
            </h2>
            <UTable :data="data.pageViewSources" :columns="[{ accessorKey: 'source', header: 'Source' }, { accessorKey: 'count', header: 'Views' }]" />
          </div>
        </div>

        <!-- Views -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Listing Views
          <UIcon name="i-lucide-eye" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Total Views" :description="fmt(data.views.total)" icon="i-lucide-eye" :ui="cardUi" />
          <UPageCard title="Authenticated" :description="fmt(data.views.authenticated)" icon="i-lucide-user" :ui="cardUi" />
          <UPageCard title="Anonymous" :description="fmt(data.views.anonymous)" icon="i-lucide-user-x" :ui="cardUi" />
          <UPageCard
            title="Avg View Duration"
            :description="data.views.avgDurationSeconds != null ? `${data.views.avgDurationSeconds}s` : 'N/A'"
            icon="i-lucide-timer"
            :ui="cardUi"
          />
        </div>

        <!-- Impressions & CTR -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Impressions & CTR
          <UIcon name="i-lucide-mouse-pointer-click" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Total Impressions" :description="fmt(data.impressions.total)" icon="i-lucide-monitor" :ui="cardUi" />
          <UPageCard title="Clicked" :description="fmt(data.impressions.clicked)" icon="i-lucide-pointer" :ui="cardUi" />
          <UPageCard title="CTR" :description="`${data.impressions.ctr}%`" icon="i-lucide-percent" :ui="cardUi" />
          <UPageCard
            title="Avg Clicked Position"
            :description="data.impressions.avgClickedPosition != null ? `#${data.impressions.avgClickedPosition}` : 'N/A'"
            icon="i-lucide-list-ordered"
            :ui="cardUi"
          />
        </div>

        <!-- Enquiry Funnel -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Enquiry Funnel
          <UIcon name="i-lucide-funnel" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Impressions" :description="fmt(data.enquiryFunnel.impressions)" icon="i-lucide-monitor" :ui="cardUi" />
          <UPageCard title="Views" :description="fmt(data.enquiryFunnel.views)" icon="i-lucide-eye" :ui="cardUi" />
          <UPageCard title="Clicks" :description="fmt(data.enquiryFunnel.clicks)" icon="i-lucide-mouse-pointer" :ui="cardUi" />
          <UPageCard title="Enquiries" :description="fmt(data.enquiryFunnel.enquiries)" icon="i-lucide-mail" :ui="cardUi" />
        </div>

        <!-- Traffic Sources, Shares, Top Lists -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Traffic Sources
              <UIcon name="i-lucide-globe" class="text-secondary" />
            </h2>
            <UTable :data="data.trafficSources" :columns="[{ accessorKey: 'source', header: 'Source' }, { accessorKey: 'count', header: 'Views' }]" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Share Platforms
              <UIcon name="i-lucide-share-2" class="text-secondary" />
            </h2>
            <UTable :data="data.sharePlatforms" :columns="[{ accessorKey: 'platform', header: 'Platform' }, { accessorKey: 'count', header: 'Shares' }]" />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top Viewed
              <UIcon name="i-lucide-eye" class="text-secondary" />
            </h2>
            <UTable :data="data.topViewedListings" :columns="[{ accessorKey: 'listingId', header: 'Listing ID' }, { accessorKey: 'views', header: 'Views' }]" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top Shared
              <UIcon name="i-lucide-share-2" class="text-secondary" />
            </h2>
            <UTable :data="data.topSharedListings" :columns="[{ accessorKey: 'listingId', header: 'Listing ID' }, { accessorKey: 'shares', header: 'Shares' }]" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top CTR
              <UIcon name="i-lucide-trending-up" class="text-secondary" />
            </h2>
            <UTable :data="data.topCtrListings" :columns="ctrColumns" />
          </div>
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

const { data, status } = await useAsyncData("admin-engagement", () =>
  useRequestFetch()("/api/admin/engagement"),
);

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-GB");

const cardUi = {
  root: "ring-1 ring-default",
  description: "title-sm font-bold text-foreground",
  leadingIcon: "text-secondary",
};

const ctrColumns = [
  { accessorKey: "listingId", header: "Listing ID" },
  { accessorKey: "clicks", header: "Clicks" },
  { accessorKey: "impressions", header: "Impressions" },
  { accessorKey: "ctr", header: "CTR %" },
];
</script>
