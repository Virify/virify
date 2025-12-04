<template>
  <div class="a-number-range">
    <AtomsRangeSelect :label="'Min ' + roomType" :options="availableMin" v-model="minValue"
      class="a-number-range__range-select" />
    <AtomsRangeSelect :label="'Max ' + roomType" :options="availableMax" v-model="maxValue"
      class="a-number-range__range-select" />
  </div>
</template>

<script setup lang="ts">
interface RoomRange {
  key: number
  value: string
  selected?: boolean
}

interface Props {
  min: RoomRange[]
  max: RoomRange[]
  roomType: string
}

const props = defineProps<Props>()

/**
 *  Selection
 */
const minValue = ref(props.min.find(({ selected }) => selected)?.key)
const maxValue = ref(props.max.find(({ selected }) => selected)?.key)

/**
 *  Avoid overlapping selections
 */
const availableMin = computed(() => {
  const { min, max } = props

  const maxKey = Number(maxValue.value)
  const selected = max.findIndex(({ key }) => key === maxKey)

  return min.slice(0, selected + 2)
})

const availableMax = computed(() => {
  const { min, max } = props

  const minKey = Number(minValue.value)
  const selected = min.findIndex(({ key }) => key === minKey)

  return max.slice(Math.max(selected - 1, 0))
})

</script>

<style lang="scss">
.a-number-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--size-8);
  flex-grow: 1;

  &__range-select {
    flex-grow: 1;
  }
}
</style>