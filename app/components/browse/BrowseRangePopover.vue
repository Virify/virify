<template>
  <PopoverRoot>
    <div v-if="legend" class="browse-range-popover__root | body-sm faded-text">
      {{ legend }}

      <PopoverTrigger type="button" class="browse-range-popover__button | body-sm">
        {{ currentSelection }}
      </PopoverTrigger>
    </div>

    <PopoverPortal>
      <PopoverContent>
        <div class="browse-range-popover__popover | gradient-box">
          <label class="browse-range-popover__popover-label | body-sm faded-text">
            {{ minLabel }}

            <AtomsSelect :name="name + '-min'" class="browse-range-popover__popover-select" :options v-model="min" />
          </label>

          <label class="browse-range-popover__popover-label | body-sm faded-text">
            {{ maxLabel }}

            <AtomsSelect :name="name + '-max'" class="browse-range-popover__popover-select" :options v-model="max" />
          </label>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

interface Props {
  legend?: string
  minLabel: string
  maxLabel: string
  name: string
  options: { key: string, value: string | number }[]
}

const props = defineProps<Props>()

/**
 *  Store min/max value
 */
const min = ref(props.options.at(0)?.value)
const max = ref(props.options.at(-1)?.value)

const currentSelection = computed(() => {
  const { options, name } = props

  // Get min, max selection
  const minSelected = options.find(({ value }) => value === min.value)
  const maxSelected = options.find(({ value }) => value === max.value)

  // If min, max the same then only show the max
  if (min.value === max.value) return maxSelected?.key

  // Disgusting temporary formatting - ignore this, it'll be deleted soon
  if (name === 'bedrooms') {
    const minValue = minSelected?.key.replace(/\sbedroom.*/, '')
    const maxValue = maxSelected?.key

    return `${minValue}-${maxValue}`
  }

  if (name === 'bathrooms') {
    const minValue = minSelected?.key.replace(/\sbathroom.*/, '')
    const maxValue = maxSelected?.key

    return `${minValue}-${maxValue}`
  }

  return `${minSelected?.key} - ${maxSelected?.key}`
})

/**
 *  Track min/max value
 */
const minMax = defineModel()

watch([min, max], () => {
  minMax.value = [min.value, max.value]
})

</script>

<style lang="scss">
.browse-range-popover {
  position: relative;

  &__root {
    display: flex;
    flex: 0;
    flex-direction: column;
    gap: var(--size-4);
    white-space: nowrap;
  }

  &__button {
    width: fit-content;
    border: 1px solid var(--input-text-border);
    border-radius: var(--border-radius-xl);
    white-space: nowrap;
    padding: var(--size-12) var(--size-20);
    white-space: nowrap;
  }

  &__popover {
    background: var(--background-100);
    padding: var(--size-12);
    width: 20ch;
  }

  &__popover-label {
    display: flex;
    flex: 1 0;
    flex-direction: column;
    gap: var(--size-4);

    &:not(:last-child) {
      margin-bottom: var(--size-12);
    }
  }

  &__popover-select {
    width: 100%;
    border: 1px solid var(--input-text-border);
    border-radius: var(--border-radius-xl);
    white-space: nowrap;
    padding: var(--size-12) var(--size-16);
    padding-right: var(--size-48);
  }
}
</style>