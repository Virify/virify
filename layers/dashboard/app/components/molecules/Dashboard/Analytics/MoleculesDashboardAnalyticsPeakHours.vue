<template>
  <UPageCard title="Peak Activity Hours" :ui="{ title: 'title-xs' }">
    <div class="p-4">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div class="grid grid-cols-6 gap-1">
          <div v-for="i in 6" :key="i" class="text-center">
            <USkeleton class="w-full aspect-square rounded mb-1" />
            <USkeleton class="h-3 w-6 mx-auto" />
          </div>
        </div>
      </template>
      
      <!-- Data state -->
      <template v-else>
        <div class="grid grid-cols-6 gap-1">
          <div v-for="hour in peakHours" :key="hour.hour" class="text-center">
            <div
              class="w-full aspect-square rounded mb-1"
              :style="{ backgroundColor: getHeatColor(hour.intensity) }"
            ></div>
            <span class="text-xs text-muted-foreground">{{ hour.label }}</span>
          </div>
        </div>
        <div class="flex justify-between mt-3 text-xs text-muted-foreground">
          <span>Less active</span>
          <span>More active</span>
        </div>
      </template>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { getHeatColor, getDefaultPeakHours } from '~~/layers/analytics/utils/analytics-helpers';

interface PeakHourData {
  hour: number;
  label: string;
  intensity: number;
}

const props = withDefaults(defineProps<{
  hours?: PeakHourData[];
  loading?: boolean;
}>(), {
  hours: () => [],
  loading: false,
});

// Use provided hours or default simulated data
const peakHours = computed(() => props.hours.length > 0 ? props.hours : getDefaultPeakHours());
</script>
