<template>
  <UDashboardPanel id="admin-search-panel">
    <template #header>
      <UDashboardNavbar title="Search Intelligence" toggle-side="left" class="border-0" :ui="{ title: 'title-sm m-0!' }" />
    </template>
    <template #body>
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 6" :key="i" class="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </template>

      <template v-else-if="data">
        <!-- Search Totals -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Search Volume
          <UIcon name="i-lucide-search" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <UPageCard title="All Time Searches" :description="fmt(data.totals.allTime)" icon="i-lucide-database" :ui="cardUi" />
          <UPageCard title="This Week" :description="fmt(data.totals.thisWeek)" icon="i-lucide-calendar" :ui="cardUi" />
          <UPageCard title="This Month" :description="fmt(data.totals.thisMonth)" icon="i-lucide-calendar-days" :ui="cardUi" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UPageCard
            title="Avg Result Count"
            :description="data.avgResultCount != null ? String(data.avgResultCount) : 'N/A'"
            icon="i-lucide-bar-chart-2"
            :ui="cardUi"
          />
        </div>

        <!-- Listing Type Split -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Search Type Split
          <UIcon name="i-lucide-pie-chart" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-3 gap-4">
          <UPageCard
            v-for="item in data.listingTypeSplit"
            :key="item.type"
            :title="item.type"
            :description="fmt(item.count)"
            icon="i-lucide-layers"
            :ui="cardUi"
          />
        </div>

        <!-- Top Queries & Locations -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top Search Queries
              <UIcon name="i-lucide-text-search" class="text-secondary" />
            </h2>
            <UTable :data="data.topQueries" :columns="queryColumns" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top Searched Locations
              <UIcon name="i-lucide-map-pin" class="text-secondary" />
            </h2>
            <UTable :data="data.topLocations" :columns="locationColumns" />
          </div>
        </div>

        <!-- Radius Histogram -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Search Radius Preferences
          <UIcon name="i-lucide-radar" class="text-secondary" />
        </h2>
        <div class="w-full">
          <UTable :data="radiusData" :columns="radiusColumns" />
        </div>

        <!-- Unmet Demand -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Unmet Demand Signals
          <UIcon name="i-lucide-alert-triangle" class="text-secondary" />
        </h2>
        <p class="body-sm text-muted">Locations where buyers search but find no listings — prime opportunities for new listings.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="body-sm font-bold mb-2">Zero-Result Searches (Top 20)</h3>
            <UTable :data="data.unmetDemand.zeroResults" :columns="zeroResultColumns" />
          </div>
          <div>
            <h3 class="body-sm font-bold mb-2">Low-Result Searches (1–4 results, Top 20)</h3>
            <UTable :data="data.unmetDemand.lowResults" :columns="lowResultColumns" />
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

const { data, status } = await useAsyncData("admin-search", () =>
  useRequestFetch()("/api/admin/search"),
);

const radiusData = computed(() => data.value?.radiusHistogram ?? []);

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-GB");

const radiusColumns = [
  { accessorKey: 'radiusMiles', header: 'Radius (miles)' },
  { accessorKey: 'count', header: 'Searches' },
];

const cardUi = {
  root: "ring-1 ring-default",
  description: "title-sm font-bold text-foreground",
  leadingIcon: "text-secondary",
};

const queryColumns = [
  { accessorKey: "query", header: "Query" },
  { accessorKey: "listingType", header: "Type" },
  { accessorKey: "count", header: "Searches" },
];

const locationColumns = [
  { accessorKey: "location", header: "Location" },
  { accessorKey: "count", header: "Searches" },
];

const zeroResultColumns = [
  { accessorKey: "location", header: "Location" },
  { accessorKey: "listingType", header: "Type" },
  { accessorKey: "searchCount", header: "Searches" },
];

const lowResultColumns = [
  { accessorKey: "location", header: "Location" },
  { accessorKey: "listingType", header: "Type" },
  { accessorKey: "searchCount", header: "Searches" },
  { accessorKey: "avgResults", header: "Avg Results" },
];
</script>
