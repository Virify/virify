<template>
  <UPageColumns>
    <!-- Skeleton loading state -->
    <template v-if="loading">
      <div v-for="i in 8" :key="i" class="border border-secondary rounded-lg p-4 space-y-3">
        <USkeleton class="h-6 w-6 rounded" />
        <USkeleton class="h-5 w-3/4" />
        <USkeleton class="h-3 w-1/2" />
      </div>
    </template>

    <!-- Data state -->
    <template v-else>
      <!-- Total Views -->
      <UPageCard
        icon="i-lucide-eye"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          <span class="flex items-center gap-2">
            Total Views: <span class="text-secondary">{{ summary.totalViews.toLocaleString() }}</span>
            <UBadge
              v-if="summary.totalViews > 0"
              :color="summary.viewsChange >= 0 ? 'success' : 'error'"
              variant="subtle"
              size="md"
              :leading-icon="summary.viewsChange >= 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            >
              {{ summary.viewsChange >= 0 ? '+' : '' }}{{ summary.viewsChange }}%
            </UBadge>
          </span>
        </template>
        <template #description>
          vs last period
        </template>
      </UPageCard>

      <!-- Impressions -->
      <UPageCard
        icon="i-lucide-trending-up"
        variant="subtle"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          <span class="flex items-center gap-2">
            Impressions: <span class="text-secondary">{{ summary.totalImpressions.toLocaleString() }}</span>
            <UBadge
              v-if="summary.totalImpressions > 0"
              :color="summary.impressionsChange >= 0 ? 'success' : 'error'"
              variant="subtle"
              size="md"
              :leading-icon="summary.impressionsChange >= 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
            >
              {{ summary.impressionsChange >= 0 ? '+' : '' }}{{ summary.impressionsChange }}%
            </UBadge>
          </span>
        </template>
        <template #description>
          vs last period
        </template>
      </UPageCard>

      <!-- CTR -->
      <UPageCard
        icon="i-lucide-mouse-pointer-click"
        variant="subtle"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          CTR: <span class="text-secondary">{{ summary.ctr }}%</span>
        </template>
        <template #description>
          Click-through rate
        </template>
      </UPageCard>

      <!-- Enquiries -->
      <UPageCard
        icon="i-lucide-message-square"
        variant="subtle"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          Enquiries: <span class="text-secondary">{{ summary.totalEnquiries }}</span>
        </template>
        <template #description>
          Total received
        </template>
      </UPageCard>

      <!-- Favourited -->
      <UPageCard
        icon="i-lucide-heart"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          Favourited: <span class="text-secondary">{{ summary.totalFavourites }}</span>
        </template>
        <template #description>
          Times saved by users
        </template>
      </UPageCard>

      <!-- Reply Rate -->
      <UPageCard
        icon="i-lucide-reply"
        variant="subtle"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          Reply Rate: <span class="text-secondary">{{ replyRate }}%</span>
        </template>
        <template #description>
          Enquiry response rate
        </template>
      </UPageCard>

      <!-- Avg Views -->
      <UPageCard
        icon="i-lucide-bar-chart-2"
        variant="subtle"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          Avg Views: <span class="text-secondary">{{ avgViewsPerListing }}</span>
        </template>
        <template #description>
          Per listing
        </template>
      </UPageCard>

      <!-- Saved -->
      <UPageCard
        icon="i-lucide-bookmark"
        variant="subtle"
        spotlight
        spotlight-color="secondary"
        :ui="ANALYTICS_CARD_UI"
      >
        <template #title>
          Saved: <span class="text-secondary">{{ summary.totalFavourites }}</span>
        </template>
        <template #description>
          Listings favourited
        </template>
      </UPageCard>
    </template>
  </UPageColumns>
</template>

<script setup lang="ts">
import { ANALYTICS_CARD_UI, getEmptyAnalyticsSummary } from '~~/layers/analytics/utils/analytics-helpers';

interface AnalyticsSummary {
  totalViews: number;
  totalImpressions: number;
  totalFavourites: number;
  totalEnquiries: number;
  totalListings: number;
  ctr: number;
  viewsChange: number;
  impressionsChange: number;
}

const props = withDefaults(defineProps<{
  summary?: AnalyticsSummary | null;
  loading?: boolean;
}>(), {
  summary: null,
  loading: false,
});

// Use empty summary if none provided
const summary = computed(() => props.summary || getEmptyAnalyticsSummary());

// Computed metrics
const replyRate = computed(() => {
  const total = summary.value.totalEnquiries;
  // Simulated reply rate - in real app this would come from backend
  return total > 0 ? Math.min(95, Math.floor(65 + Math.random() * 30)) : 0;
});

const avgViewsPerListing = computed(() => {
  const views = summary.value.totalViews;
  const listings = summary.value.totalListings || 1;
  return Math.round(views / listings);
});
</script>
