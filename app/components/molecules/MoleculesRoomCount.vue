<template>
  <div class="a-number-range | gradient-box">
    <AtomsRangeSelect label="From" :options="availableMin" v-model="minValue" />
    <AtomsRangeSelect label="To" :options="availableMax" v-model="maxValue" />
  </div>
</template>

<script setup>
/**
 *  Raw options
 */
const min = [
  { key: 0, value: 'No min', selected: true },
  { key: 0.5, value: 'Studio' },
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5' },
  { key: 6, value: '6' },
  { key: 7, value: '7' },
  { key: 8, value: '8+' }
]

const max = [
  { key: 0.5, value: 'Studio' },
  { key: 1, value: '1' },
  { key: 2, value: '2' },
  { key: 3, value: '3' },
  { key: 4, value: '4' },
  { key: 5, value: '5' },
  { key: 6, value: '6' },
  { key: 7, value: '7' },
  { key: 8, value: '8' },
  { key: 9, value: 'No max', selected: true }
]

/**
 *  Selection
 */
const minValue = ref(min.find(({ selected }) => selected)?.key)
const maxValue = ref(max.find(({ selected }) => selected)?.key)

/**
 *  Avoid overlapping selections
 */
const availableMin = computed(() => {
  const maxKey = maxValue.value
  const selected = max.findIndex(({ key }) => key === maxKey)

  return min.slice(0, selected + 2)
})

const availableMax = computed(() => {
  const minKey = minValue.value
  const selected = min.findIndex(({ key }) => key === minKey)

  return max.slice(Math.max(selected - 1, 0))
})

</script>

<style lang="scss">
.a-number-range {
  padding: var(--size-12);

  input {
    display: block;
  }
}
</style>