<template>
  <UPageCard title="Traffic Sources" :ui="{ title: 'title-xs' }">
    <div class="p-4 space-y-3">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div v-for="i in 4" :key="i" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <USkeleton class="h-5 w-5 rounded" />
            <USkeleton class="h-4 w-16" />
          </div>
          <div class="flex items-center gap-3">
            <USkeleton class="h-2 w-16 sm:w-24 rounded-full" />
            <USkeleton class="h-4 w-10" />
          </div>
        </div>
      </template>
      
      <!-- Data state -->
      <template v-else-if="sources.length > 0">
        <div v-for="source in sources" :key="source.source" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon :name="getSourceIcon(source.source)" class="text-secondary" />
            <span class="body-sm capitalize">{{ source.source }}</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-16 sm:w-24 bg-muted rounded-full h-2">
              <div class="bg-secondary h-2 rounded-full transition-all" :style="{ width: `${source.percentage}%` }"></div>
            </div>
            <span class="body-sm text-muted-foreground w-10 sm:w-12 text-right">{{ source.percentage }}%</span>
          </div>
        </div>
      </template>
      
      <!-- Empty state -->
      <div v-else class="text-center py-4">
        <UIcon name="i-lucide-globe" class="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p class="body-sm text-muted-foreground">No traffic data yet</p>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { getSourceIcon } from '~~/layers/analytics/utils/analytics-helpers';

interface TrafficSource {
  source: string;
  count: number;
  percentage: number;
}

withDefaults(defineProps<{
  sources?: TrafficSource[];
  loading?: boolean;
}>(), {
  sources: () => [],
  loading: false,
});
</script>
