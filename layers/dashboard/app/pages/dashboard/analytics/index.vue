<template>
  <UDashboardPanel id="analytics-panel">
    <template #header>
      <UDashboardNavbar title="Analytics" toggle-side="left" class="border-0" :ui="{
        title: 'title-sm m-0!',
      }">
        <template #right>
          <USelect
            v-model="selectedListingId"
            :items="listingOptions"
            option-attribute="label"
            value-attribute="value"
            icon="i-lucide-home"
            color="primary"
            variant="ghost"
            size="md"
            class="body-sm min-w-52 text-white"
            :ui="{
              base: 'cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
              value: 'text-white',
              leadingIcon: 'text-white',
              trailingIcon: 'text-white',
              group: 'bg-(--background-100) text-(--foreground-100) p-1',
              item: 'hover:bg-(--background-200)',
            }"
            trailing-icon="i-lucide-chevron-down"
            @update:model-value="changeListing"
          />
          <USelect v-model="selectedPeriod" :items="PERIOD_OPTIONS" option-attribute="label" value-attribute="value"
            icon="i-lucide-calendar" color="primary" variant="ghost" size="md" class="body-sm text-white" :ui="{
              base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
              value: 'text-white',
              leadingIcon: 'text-white',
              trailingIcon: 'text-white',
              group: 'bg-(--background-100) text-(--foreground-100) p-1',
              item: 'hover:bg-(--background-200)',
            }" trailing-icon="i-lucide-chevron-down" @update:model-value="changePeriod" />
          <OrganismsDashboardNotificationButton />
        </template>

      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Summary Cards -->
      <OrganismsDashboardAnalyticsSummaryCards :summary="comprehensiveAnalytics?.summary"
        :loading="isComprehensiveLoading" />

      <!-- Views & Impressions Chart -->
      <MoleculesDashboardAnalyticsViewsChart :time-series="comprehensiveAnalytics?.timeSeries || []"
        :period-label="periodLabel" :loading="isComprehensiveLoading" />

      <!-- Two column layout for breakdowns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MoleculesDashboardAnalyticsTrafficSources :sources="comprehensiveAnalytics?.trafficSources || []"
          :loading="isComprehensiveLoading" />

        <MoleculesDashboardAnalyticsDeviceBreakdown :devices="comprehensiveAnalytics?.deviceBreakdown || []"
          :loading="isComprehensiveLoading" />
      </div>

      <!-- Engagement Stats Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MoleculesDashboardAnalyticsConversionFunnel :summary="comprehensiveAnalytics?.summary"
          :loading="isComprehensiveLoading" />

        <MoleculesDashboardAnalyticsPeakHours :loading="isComprehensiveLoading" />

        <MoleculesDashboardAnalyticsPerformanceSummary :time-series="comprehensiveAnalytics?.timeSeries || []"
          :top-listings="comprehensiveAnalytics?.topListings || []"
          :device-breakdown="comprehensiveAnalytics?.deviceBreakdown || []" :loading="isComprehensiveLoading" />
      </div>

      <!-- Top Performing Listings -->
      <MoleculesDashboardAnalyticsTopListings
        :title="selectedListingId ? 'Listing Performance' : 'Top Performing Listings'"
        :description="selectedListingId ? 'Metrics for the selected listing' : 'Sorted by views'"
        :listings="comprehensiveAnalytics?.topListings || []"
        :loading="isComprehensiveLoading" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { PERIOD_OPTIONS, getPeriodLabel } from '~~/layers/analytics/utils/analytics-helpers';
import type { AnalyticsPeriod } from '~~/layers/analytics/utils/analytics-helpers';

definePageMeta({
  layout: 'dashboard',
  middleware: ['authenticated'],
});

const {
  comprehensiveAnalytics,
  isComprehensiveLoading,
  selectedPeriod,
  selectedListingId,
  allUserListings,
  fetchAnalytics,
  fetchComprehensiveAnalytics,
} = useAnalytics();

const periodLabel = computed(() => getPeriodLabel(selectedPeriod.value));
const listingOptions = computed(() => [
  { label: 'All listings', value: null },
  ...allUserListings.value
    .filter((listing) => !listing.isDraft)
    .map((listing) => ({
      label: formatListingLabel(listing),
      value: listing.id,
    })),
]);

onMounted(() => {
  fetchAnalytics();
  fetchComprehensiveAnalytics();
});

const changePeriod = (period: AnalyticsPeriod) => {
  fetchComprehensiveAnalytics(period, selectedListingId.value);
};

const changeListing = (listingId: number | null) => {
  fetchComprehensiveAnalytics(selectedPeriod.value, listingId);
};

function formatListingLabel(listing: OwnedListingWithAnalytics) {
  const address = listing.property?.address;
  const fallback = `Listing #${listing.id}`;

  return [address?.street, address?.city].filter(Boolean).join(', ') || fallback;
}
</script>
