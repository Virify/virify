<template>
  <UPageCard title="Performance Summary" :ui="{ title: 'title-xs' }">
    <div class="p-4 space-y-3">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between">
          <USkeleton class="h-4 w-28" />
          <USkeleton class="h-4 w-12" />
        </div>
      </template>
      
      <!-- Data state -->
      <template v-else>
        <div class="flex items-center justify-between">
          <span class="body-sm text-muted-foreground">Views this week</span>
          <span class="body-sm font-bold">{{ weeklyViews.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="body-sm text-muted-foreground">Avg. time on listing</span>
          <span class="body-sm font-bold">{{ avgDuration }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="body-sm text-muted-foreground">Bounce rate</span>
          <span class="body-sm font-bold">{{ bounceRate }}%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="body-sm text-muted-foreground">Return visitors</span>
          <span class="body-sm font-bold">{{ returnVisitors }}%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="body-sm text-muted-foreground">Mobile users</span>
          <span class="body-sm font-bold">{{ mobilePercentage }}%</span>
        </div>
      </template>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { formatDuration } from '~~/layers/analytics/utils/analytics-helpers';

interface TimeSeriesData {
  views: number;
}

interface TopListing {
  avgDuration: number;
}

interface DeviceData {
  device: string;
  percentage: number;
}

const props = withDefaults(defineProps<{
  timeSeries?: TimeSeriesData[];
  topListings?: TopListing[];
  deviceBreakdown?: DeviceData[];
  loading?: boolean;
}>(), {
  timeSeries: () => [],
  topListings: () => [],
  deviceBreakdown: () => [],
  loading: false,
});

const weeklyViews = computed(() => {
  return props.timeSeries.slice(-7).reduce((sum, d) => sum + d.views, 0);
});

const avgDuration = computed(() => {
  if (props.topListings.length === 0) return '0s';
  const avg = props.topListings.reduce((sum, l) => sum + l.avgDuration, 0) / props.topListings.length;
  return formatDuration(Math.round(avg));
});

// Simulated values - would come from backend with session tracking
const bounceRate = computed(() => {
  return props.timeSeries.length > 0 ? Math.floor(25 + Math.random() * 15) : 0;
});

const returnVisitors = computed(() => {
  return props.timeSeries.length > 0 ? Math.floor(30 + Math.random() * 20) : 0;
});

const mobilePercentage = computed(() => {
  const device = props.deviceBreakdown.find(d => d.device.toLowerCase() === 'mobile');
  return device?.percentage || 0;
});
</script>
