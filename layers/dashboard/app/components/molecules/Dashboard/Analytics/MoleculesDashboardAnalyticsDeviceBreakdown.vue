<template>
  <UPageCard title="Device Breakdown" :ui="{ title: 'title-xs' }">
    <div class="p-4">
      <!-- Skeleton loading -->
      <template v-if="loading">
        <div class="flex flex-col items-center">
          <USkeleton class="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] rounded-full" />
          <div class="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
            <div v-for="i in 3" :key="i" class="flex items-center gap-2">
              <USkeleton class="w-3 h-3 rounded-full" />
              <USkeleton class="h-4 w-12" />
              <USkeleton class="h-4 w-8" />
            </div>
          </div>
        </div>
      </template>
      
      <!-- Data state -->
      <template v-else-if="devices.length > 0">
        <div class="flex flex-col items-center">
          <div class="chart-container-doughnut">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div class="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
            <div v-for="(device, index) in devices" :key="device.device" class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: deviceColors[index] || deviceColors[0] }"></div>
              <span class="body-sm">{{ device.device }}</span>
              <span class="body-sm font-bold">{{ device.percentage }}%</span>
            </div>
          </div>
        </div>
      </template>
      
      <!-- Empty state -->
      <div v-else class="flex flex-col items-center py-4">
        <UIcon name="i-lucide-monitor-smartphone" class="w-12 h-12 text-muted-foreground mb-3" />
        <p class="body-sm text-muted-foreground">No device data yet</p>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import { Chart, registerables } from 'chart.js';
import { DEVICE_COLORS } from '~~/layers/analytics/utils/analytics-helpers';

Chart.register(...registerables);

interface DeviceData {
  device: string;
  count: number;
  percentage: number;
}

const props = withDefaults(defineProps<{
  devices?: DeviceData[];
  loading?: boolean;
}>(), {
  devices: () => [],
  loading: false,
});

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const deviceColors = DEVICE_COLORS;

const renderChart = () => {
  if (!chartCanvas.value || props.devices.length === 0) return;
  
  if (chartInstance) chartInstance.destroy();
  
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;
  
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: props.devices.map(d => d.device),
      datasets: [{
        data: props.devices.map(d => d.count),
        backgroundColor: deviceColors,
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '60%',
      plugins: {
        legend: { display: false },
      },
    },
  });
};

watch(() => props.devices, () => {
  if (props.devices.length > 0) {
    nextTick(renderChart);
  }
}, { immediate: true });

onUnmounted(() => {
  if (chartInstance) chartInstance.destroy();
});
</script>

<style scoped>
.chart-container-doughnut {
  position: relative;
  width: 120px;
  height: 120px;
}

@media (min-width: 400px) {
  .chart-container-doughnut {
    width: 150px;
    height: 150px;
  }
}

@media (min-width: 640px) {
  .chart-container-doughnut {
    width: 180px;
    height: 180px;
  }
}
</style>
