<template>
  <UDashboardPanel id="analytics-panel">
    <template #header>
      <UDashboardNavbar
        title="Analytics"
        toggle-side="left"
        class="border-0"
        :ui="{
          title: 'title-sm m-0!',
        }"
      >
        <template #right>
          <USelect
            v-model="selectedPeriod"
            :items="PERIOD_OPTIONS"
            option-attribute="label"
            value-attribute="value"
            icon="i-lucide-calendar"
            color="primary"
            variant="ghost"
            size="md"
            class="body-sm text-white"
            :ui="{
              base: 'capitalize cursor-pointer bg-(--blue-400)! hover:bg-(--blue-500)!',
              value: 'text-white',
              leadingIcon: 'text-white',
              trailingIcon: 'text-white',
              group: 'bg-(--background-200) text-(--foreground-100) p-1',
              item: 'hover:bg-(--background-100)',
            }"
            trailing-icon="i-lucide-chevron-down"
            @update:model-value="changePeriod"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Summary Cards -->
      <OrganismsDashboardAnalyticsSummaryCards
        :summary="comprehensiveAnalytics?.summary"
        :loading="isComprehensiveLoading"
      />

      <!-- Views & Impressions Chart -->
      <MoleculesDashboardAnalyticsViewsChart
        :time-series="comprehensiveAnalytics?.timeSeries || []"
        :period-label="periodLabel"
        :loading="isComprehensiveLoading"
      />

      <!-- Two column layout for breakdowns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <MoleculesDashboardAnalyticsTrafficSources
          :sources="comprehensiveAnalytics?.trafficSources || []"
          :loading="isComprehensiveLoading"
        />
        
        <MoleculesDashboardAnalyticsDeviceBreakdown
          :devices="comprehensiveAnalytics?.deviceBreakdown || []"
          :loading="isComprehensiveLoading"
        />
      </div>

      <!-- Engagement Stats Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <MoleculesDashboardAnalyticsConversionFunnel
          :summary="comprehensiveAnalytics?.summary"
          :loading="isComprehensiveLoading"
        />
        
        <MoleculesDashboardAnalyticsPeakHours
          :loading="isComprehensiveLoading"
        />
        
        <MoleculesDashboardAnalyticsPerformanceSummary
          :time-series="comprehensiveAnalytics?.timeSeries || []"
          :top-listings="comprehensiveAnalytics?.topListings || []"
          :device-breakdown="comprehensiveAnalytics?.deviceBreakdown || []"
          :loading="isComprehensiveLoading"
        />
      </div>

      <!-- Top Performing Listings -->
      <MoleculesDashboardAnalyticsTopListings
        :listings="comprehensiveAnalytics?.topListings || []"
        :loading="isComprehensiveLoading"
      />
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

const { comprehensiveAnalytics, isComprehensiveLoading, selectedPeriod, fetchComprehensiveAnalytics } = useAnalytics();

const periodLabel = computed(() => getPeriodLabel(selectedPeriod.value));

onMounted(() => {
  fetchComprehensiveAnalytics();
});

const changePeriod = (period: AnalyticsPeriod) => {
  fetchComprehensiveAnalytics(period);
};
</script>
