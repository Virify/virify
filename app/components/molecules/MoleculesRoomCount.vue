<template>
  <div class="a-number-range | gradient-box">
    <AtomsRangeSelect label="From" :options="min" />
    <AtomsRangeSelect label="To" :options="max" />
  </div>
</template>

<script setup>
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
  { key: 0, value: 'No max', selected: true }
]

</script>

<style lang="scss">
.a-number-range {
  padding: var(--size-12);

  input {
    display: block;
  }
}
</style>