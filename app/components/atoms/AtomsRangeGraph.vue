<template>
  <canvas width="600" height="80" ref="$canvas"></canvas>
</template>

<script setup lang="ts">
interface Props {
  min: number
  max: number
  range: [number, number]
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

/**
 *  Canvas
 */
const $canvas = ref(null)

/**
 *  Mock data
 */
const data = ref([
  { amount: 1 },
  { amount: 2 },
  { amount: 20 },
  { amount: 43 },
  { amount: 9 },
  { amount: 24 },
  { amount: 9 },
  { amount: 11 },
  { amount: 2 },
  { amount: 5 },
  { amount: 2 },
  { amount: 1 },
  { amount: 0 },
  { amount: 1 },
])

/**
 *  Mount
 */
onMounted(() => {
  if (!data.value) return

  try {
    const { drawChart } = usePriceChart($canvas.value, {
      data: data.value,
      emptyLineColour: 'rgba(0, 0, 0, 0.05)',
      lineColour: '#FD8E61',
      lineThickness: 4
    })

    watch(percentages, ({ min, max }) => {
      drawChart({ min, max })
    }, { immediate: true })
  } catch (err) {
    $canvas.value.hidden = true
  }
})
</script>

<style scoped>
canvas {
  pointer-events: none;
}
</style>