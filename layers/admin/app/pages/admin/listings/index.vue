<template>
  <UDashboardPanel id="admin-listings-panel">
    <template #header>
      <UDashboardNavbar title="Listings Analytics" toggle-side="left" class="border-0" :ui="{ title: 'title-sm m-0!' }" />
    </template>
    <template #body>
      <template v-if="status === 'pending'">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="h-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </template>

      <template v-else-if="data">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="w-full sm:max-w-md">
            <label class="body-sm font-bold mb-2 block">Search listing analytics</label>
            <UInput
              v-model="listingSearch"
              icon="i-lucide-search"
              placeholder="Listing ID, owner, street, city, postcode"
              @keydown.enter="refresh"
            />
          </div>
          <UButton icon="i-lucide-search" color="primary" @click="refresh">
            Search
          </UButton>
        </div>

        <div>
          <h2 class="title-xs mb-2! flex items-center gap-2">
            Listing Performance
            <UIcon name="i-lucide-chart-no-axes-combined" class="text-secondary" />
          </h2>
          <UTable :data="data.listingPerformance" :columns="listingPerformanceColumns" />
        </div>

        <!-- Listing Funnel -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Listing Funnel
          <UIcon name="i-lucide-filter" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <UPageCard title="Published" :description="fmt(data.funnel.published)" icon="i-lucide-globe" :ui="cardUi" />
          <UPageCard title="Drafts" :description="fmt(data.funnel.drafts)" icon="i-lucide-file-edit" :ui="cardUi" />
          <UPageCard title="Archived" :description="fmt(data.funnel.archived)" icon="i-lucide-archive" :ui="cardUi" />
          <UPageCard title="Abandoned Drafts" :description="fmt(data.funnel.abandonedDrafts)" icon="i-lucide-file-x" :ui="cardUi" />
          <UPageCard title="In-Progress Drafts" :description="fmt(data.funnel.inProgressDrafts)" icon="i-lucide-file-clock" :ui="cardUi" />
          <UPageCard title="Completed Drafts" :description="fmt(data.funnel.completedDrafts)" icon="i-lucide-file-check" :ui="cardUi" />
          <UPageCard title="Avg Steps Completed" :description="String(data.funnel.avgStepsCompleted)" icon="i-lucide-list-checks" :ui="cardUi" />
        </div>

        <!-- Tier & Verification -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Listing Tier Breakdown
              <UIcon name="i-lucide-layers" class="text-secondary" />
            </h2>
            <UTable :data="data.tierBreakdown" :columns="[{ accessorKey: 'tier', header: 'Tier' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Verification Level
              <UIcon name="i-lucide-shield-check" class="text-secondary" />
            </h2>
            <UTable :data="data.verificationBreakdown" :columns="[{ accessorKey: 'level', header: 'Level' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
        </div>

        <!-- Price -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Price Distribution
          <UIcon name="i-lucide-pound-sterling" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <UPageCard
            v-for="bracket in data.priceDistribution"
            :key="bracket.bracket"
            :title="bracket.bracket"
            :description="fmt(bracket.count)"
            icon="i-lucide-banknote"
            :ui="cardUi"
          />
        </div>

        <!-- Price Reductions -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Price Reductions
          <UIcon name="i-lucide-trending-down" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-2 gap-4">
          <UPageCard title="Total Reductions" :description="fmt(data.priceReductions.total)" icon="i-lucide-arrow-down-circle" :ui="cardUi" />
          <UPageCard
            title="Avg Change %"
            :description="data.priceReductions.avgChangePercent != null ? `${data.priceReductions.avgChangePercent}%` : 'N/A'"
            icon="i-lucide-percent"
            :ui="cardUi"
          />
        </div>

        <!-- Sale Breakdown -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Sale Listings
          <UIcon name="i-lucide-home" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="body-sm font-bold mb-2">Tenure Type</h3>
            <UTable :data="data.saleBreakdown.tenureType" :columns="[{ accessorKey: 'type', header: 'Tenure' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
          <div>
            <h3 class="body-sm font-bold mb-2">Availability Status</h3>
            <UTable :data="data.saleBreakdown.availability" :columns="[{ accessorKey: 'status', header: 'Status' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UPageCard title="Chain" :description="fmt(data.saleBreakdown.chain)" icon="i-lucide-link" :ui="cardUi" />
          <UPageCard title="Shared Ownership" :description="fmt(data.saleBreakdown.sharedOwnership)" icon="i-lucide-users" :ui="cardUi" />
        </div>

        <!-- Rental Breakdown -->
        <h2 class="title-xs mb-0! flex items-center gap-2">
          Rental Listings
          <UIcon name="i-lucide-key" class="text-secondary" />
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="body-sm font-bold mb-2">Furnished Status</h3>
            <UTable :data="data.rentalBreakdown.furnishedStatus" :columns="[{ accessorKey: 'status', header: 'Status' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
          <div>
            <h3 class="body-sm font-bold mb-2">Availability Status</h3>
            <UTable :data="data.rentalBreakdown.availability" :columns="[{ accessorKey: 'status', header: 'Status' }, { accessorKey: 'count', header: 'Count' }]" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <UPageCard title="Bills Included" :description="fmt(data.rentalBreakdown.billsIncluded)" icon="i-lucide-receipt" :ui="cardUi" />
        </div>

        <!-- Hidden & Top Favourited -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Hidden Listings
              <UIcon name="i-lucide-eye-off" class="text-secondary" />
            </h2>
            <UPageCard title="Total Hidden" :description="fmt(data.hiddenListings.total)" icon="i-lucide-eye-off" :ui="cardUi" />
          </div>
          <div>
            <h2 class="title-xs mb-2! flex items-center gap-2">
              Top Favourited Listings
              <UIcon name="i-lucide-heart" class="text-secondary" />
            </h2>
            <UTable :data="data.topFavourited" :columns="[{ accessorKey: 'listingId', header: 'Listing ID' }, { accessorKey: 'count', header: 'Favourites' }]" />
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

const listingSearch = ref("");
const listingPerformanceColumns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "address", header: "Listing" },
  { accessorKey: "owner", header: "Owner" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "views", header: "Views" },
  { accessorKey: "impressions", header: "Impressions" },
  { accessorKey: "clicks", header: "Clicks" },
  { accessorKey: "ctr", header: "CTR %" },
  { accessorKey: "favourites", header: "Favourites" },
  { accessorKey: "enquiries", header: "Enquiries" },
];

const { data, status, refresh } = await useAsyncData("admin-listings", () => {
  const params = new URLSearchParams();
  if (listingSearch.value.trim()) {
    params.set("search", listingSearch.value.trim());
  }

  const query = params.toString();
  return useRequestFetch()(`/api/admin/listings${query ? `?${query}` : ""}`);
});

const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-GB");

const cardUi = {
  root: "ring-1 ring-default",
  description: "title-sm font-bold text-foreground",
  leadingIcon: "text-secondary",
};
</script>
