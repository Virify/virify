<template>
  <UPageCard title="Views & Impressions Over Time" :ui="{ container: 'mb-6', title: 'title-xs' }">
    <template #description>
      <span class="body-sm text-muted-foreground">{{ periodLabel }} performance</span>
    </template>
    <div class="p-2 sm:p-4">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div class="chart-container flex items-center justify-center">
          <div class="space-y-4 w-full">
            <USkeleton class="h-4 w-full" />
            <USkeleton class="h-32 w-full" />
            <div class="flex justify-center gap-4">
              <USkeleton class="h-3 w-16" />
              <USkeleton class="h-3 w-20" />
            </div>
          </div>
        </div>
      </template>
      
      <!-- Empty state -->
      <template v-else-if="!hasData">
        <div class="chart-container flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-lucide-line-chart" class="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p class="body-sm text-muted-foreground">Not enough data yet</p>
            <p class="text-xs text-muted-foreground mt-1">Check back soon for insights</p>
          </div>
        </div>
      </template>
      
      <!-- Chart -->
      <template v-else>
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </template>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import { useWindowSize, useDebounceFn } from '@vueuse/core';
import { ANALYTICS_COLORS, formatChartDate } from '~~/layers/analytics/utils/analytics-helpers';

Chart.register(...registerables);

interface TimeSeriesData {
  date: string;
  views: number;
  impressions: number;
}

const props = withDefaults(defineProps<{
  timeSeries?: TimeSeriesData[];
  periodLabel?: string;
  loading?: boolean;
}>(), {
  timeSeries: () => [],
  periodLabel: '30 Days',
  loading: false,
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const { width: windowWidth } = useWindowSize();
const isMobile = computed(() => windowWidth.value < 400);

const hasData = computed(() => props.timeSeries.length > 0);

// Debounced chart re-render
const debouncedRender = useDebounceFn(() => {
  if (hasData.value) renderChart();
}, 150);

const renderChart = () => {
  if (!chartCanvas.value) return;
  
  if (chartInstance) chartInstance.destroy();
  
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;
  
  const mobile = isMobile.value;
  const data = mobile ? props.timeSeries.slice(-10) : props.timeSeries;
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => formatChartDate(d.date, mobile)),
      datasets: [
        {
          label: 'Views',
          data: data.map(d => d.views),
          borderColor: ANALYTICS_COLORS.BRAND_ORANGE,
          backgroundColor: `${ANALYTICS_COLORS.BRAND_ORANGE}20`,
          fill: true,
          tension: 0.4,
          borderWidth: mobile ? 1.5 : 2,
          pointRadius: mobile ? 2 : 3,
        },
        {
          label: 'Impressions',
          data: data.map(d => d.impressions),
          borderColor: ANALYTICS_COLORS.BRAND_PURPLE,
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          borderWidth: mobile ? 1.5 : 2,
          pointRadius: mobile ? 2 : 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      layout: {
        padding: mobile ? { left: 0, right: 0, top: 5, bottom: 0 } : { left: 5, right: 10, top: 10, bottom: 5 },
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: mobile ? 8 : 10,
            padding: mobile ? 6 : 12,
            font: { size: mobile ? 9 : 10 },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(128, 128, 128, 0.1)' },
          ticks: {
            font: { size: mobile ? 8 : 9 },
            maxTicksLimit: mobile ? 4 : 5,
            padding: mobile ? 2 : 5,
          },
        },
        x: {
          grid: { display: false },
          ticks: {
            font: { size: mobile ? 7 : 9 },
            maxRotation: mobile ? 0 : 45,
            minRotation: 0,
            maxTicksLimit: mobile ? 5 : 10,
            padding: mobile ? 2 : 5,
          },
        },
      },
    },
  });
};

// Watch for data changes
watch(() => props.timeSeries, () => {
  if (hasData.value) {
    nextTick(renderChart);
  }
}, { immediate: true });

// Watch for resize
watch(windowWidth, () => {
  debouncedRender();
});

// Immediate re-render on mobile breakpoint crossing
watch(isMobile, () => {
  if (hasData.value) {
    nextTick(renderChart);
  }
});

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 200px;
}

@media (min-width: 400px) {
  .chart-container {
    height: 250px;
  }
}

@media (min-width: 640px) {
  .chart-container {
    height: 300px;
  }
}

@media (min-width: 768px) {
  .chart-container {
    height: 350px;
  }
}
</style>
