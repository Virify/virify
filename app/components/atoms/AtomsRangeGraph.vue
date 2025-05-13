<template>
  <canvas width="600" height="80" ref="$canvas"></canvas>
</template>

<script setup lang="ts">
interface Props {
  min: number
  max: number
  range: [number, number],
  graphData?: number[]
}

const props = defineProps<Props>()

/**
 *  Get percentage width for canvas
 */
const percentages = computed(() => {
  const { min, max, range } = props

  // Get maximum range
  const maxRange = (max - min)

  // Return min, max as percentage of that range
  return {
    min: 100 * ((range[0] - min) / maxRange),
    max: 100 * ((range[1] - min) / maxRange)
  }
})

const validGraphData = computed(() => {
  const { graphData } = props

  if (!Array.isArray(graphData)) return []

  console.log({ graphData })

  return graphData
})

/**
 *  Canvas
 */
const $canvas = ref(null)

/**
 *  Mount
 */
onMounted(() => {
  try {
    const { drawChart } = usePriceChart($canvas.value, {
      emptyFillColour: 'rgba(0, 0, 0, 0.05)',
      fillColour: '#FD8E61'
    })

    watch([percentages, validGraphData], ([{ min, max }, data]) => {
      drawChart(data, { min, max })
    }, { immediate: true })
  } catch (err) {
    console.error(err)

    $canvas.value.hidden = true
  }
})
</script>

<style scoped>
canvas {
  pointer-events: none;
}
</style>