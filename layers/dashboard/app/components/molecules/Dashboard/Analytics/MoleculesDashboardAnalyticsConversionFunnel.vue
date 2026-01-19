<template>
  <UPageCard title="Conversion Funnel" :ui="{ title: 'title-xs' }">
    <div class="p-4 space-y-4">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="space-y-1">
          <div class="flex items-center justify-between mb-1">
            <USkeleton class="h-4 w-20" />
            <USkeleton class="h-4 w-12" />
          </div>
          <USkeleton class="h-2 w-full rounded-full" />
        </div>
      </template>
      
      <!-- Data state -->
      <template v-else>
        <div v-for="(step, index) in funnel" :key="step.label" class="relative">
          <div class="flex items-center justify-between mb-1">
            <span class="body-sm">{{ step.label }}</span>
            <span class="body-sm font-bold">{{ step.value.toLocaleString() }}</span>
          </div>
          <div class="w-full bg-muted rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all"
              :class="index === 0 ? 'bg-secondary' : 'bg-secondary/70'"
              :style="{ width: `${step.percentage}%` }"
            ></div>
          </div>
        </div>
      </template>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { calculateConversionFunnel } from '~~/layers/analytics/utils/analytics-helpers';

interface AnalyticsSummary {
  totalImpressions: number;
  totalViews: number;
  totalFavourites: number;
  totalEnquiries: number;
}

const props = withDefaults(defineProps<{
  summary?: AnalyticsSummary | null;
  loading?: boolean;
}>(), {
  summary: null,
  loading: false,
});

const funnel = computed(() => calculateConversionFunnel(props.summary));
</script>
