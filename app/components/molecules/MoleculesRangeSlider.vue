<template>
  <div>
    <SliderRoot v-model="rangeValue" :min="0" :max="100" class="m-range-slider">
      <SliderTrack class="m-range-slider-track">
        <SliderRange class="m-range-slider-range" />
      </SliderTrack>
      <SliderThumb class="m-range-slider-thumb" />
      <SliderThumb class="m-range-slider-thumb" />
    </SliderRoot>

    <div>{{ rangeValue }}</div>
  </div>
</template>

<script setup>
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui'

const rangeValue = ref([50, 100])
</script>

<style lang="scss">
.m-range-slider {
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: var(--size-32);
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