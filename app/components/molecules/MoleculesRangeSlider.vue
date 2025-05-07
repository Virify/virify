<template>
  <div class="m-range-slider">
    <SliderRoot v-model="rangeValue" :min="min" :max="max" class="m-range-slider-root">
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
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "reka-ui";

/**
 *  Props
 */
const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  startingMin: {
    type: Number,
    default: 0,
  },
  startingMax: {
    type: Number,
    default: 100,
  },
});

const rangeValue = defineModel<[number, number]>({
  default: [0, 0],
});

// Set the actual default values from props after the component is mounted
// avoid hosting issue?
onMounted(() => {
  rangeValue.value = [props.startingMin, props.startingMax];
});

/**
 * Watchers
 */
watch(
  () => [props.min, props.max, props.startingMin, props.startingMax],
  ([newMin, newMax, newStartingMin, newStartingMax]) => {
    // Update rangeValue to stay within the new bounds
    rangeValue.value = [
      Math.max(newMin ?? 0, newStartingMin ?? 0),
      Math.min(newMax ?? 100, newStartingMax ?? 100),
    ];
  }
);
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
