<template>
  <div class="m-range-slider">
    <SliderRoot v-model="rangeValue" :min :max class="m-range-slider-root">
      <SliderTrack class="m-range-slider-track">
        <SliderRange class="m-range-slider-range" />
      </SliderTrack>
      <SliderThumb class="m-range-slider-thumb" />
      <SliderThumb class="m-range-slider-thumb" />
    </SliderRoot>

    <label class="m-range-slider-label-min | body-sm">
      <input type="number" v-model="rangeValue[0]" class="m-range-slider-input | text-input focus-visible" />
      Min price
    </label>

    <label class="m-range-slider-label-max | body-sm">
      <input type="number" v-model="rangeValue[1]" class="m-range-slider-input | text-input focus-visible" />
      Max price
    </label>
  </div>
</template>

<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui'

/**
 *  Props
 */
interface Props {
  min?: number
  max?: number
  startingMin?: number
  startingMax?: number
}

withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  startingMin: 25,
  startingMax: 75
})

/**
 *  Values
 */
const rangeValue = defineModel({
  default: ({ startingMin, startingMax }): number[] => {
    return [startingMin as number, startingMax as number]
  }
})
</script>

<style lang="scss">
.m-range-slider {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: var(--size-12);
  margin: 0;
}

.m-range-slider-label-min,
.m-range-slider-label-max {
  display: flex;
  flex-direction: column;
}

.m-range-slider-label-min {
  text-align: left;
  align-items: flex-start;
}

.m-range-slider-label-max {
  text-align: right;
  align-items: flex-end;
}

.m-range-slider-input {
  margin-bottom: var(--size-4);
  text-align: inherit;
  max-width: 15ch;
}

/**
 *  Range slider styling
 */
.m-range-slider-root {
  grid-column: span 2;
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: var(--size-32);
  flex-shrink: 1;
}

.m-range-slider-track {
  position: relative;
  background: light-dark(var(--monochrome-700), var(--monochrome-200));
  flex-grow: 1;
  height: var(--size-6);
  border-radius: var(--border-radius-ui);
}

.m-range-slider-range {
  position: absolute;
  border-radius: var(--border-radius-pill);
  background: light-dark(var(--secondary-300), var(--secondary-500));
  height: 100%;
}

.m-range-slider-thumb {
  display: block;
  width: var(--size-32);
  height: var(--size-32);
  background: light-dark(var(--secondary-500), var(--secondary-300));
  border: 2px solid light-dark(var(--secondary-300), var(--secondary-500));
  border-radius: 100%;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>