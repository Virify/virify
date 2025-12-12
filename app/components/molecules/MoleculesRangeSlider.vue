<template>
  <div class="m-range-slider | relative">
    <AtomsRangeGraph v-if="graphData.length" :min :max :range="selectedRange" :graph-data="graphData"
      class="m-range-slider-graph" />

    <AtomsLabel class="m-range-slider-label-min">
      <AtomsCurrencyInput v-model="selectedRange[0]" class="m-range-slider-input | body-md" />
    </AtomsLabel>

    <AtomsLabel class="m-range-slider-label-max">
      <AtomsCurrencyInput v-model="selectedRange[1]" class="m-range-slider-input | body-md" />
    </AtomsLabel>

    <SliderRoot v-model="selectedRange" :min="min" :max="max" class="m-range-slider-root">
      <SliderTrack class="m-range-slider-track">
        <SliderRange class="m-range-slider-range" />
      </SliderTrack>
      <SliderThumb class="m-range-slider-thumb" />
      <SliderThumb class="m-range-slider-thumb" />
    </SliderRoot>
  </div>
</template>

<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "reka-ui";

const props = defineProps({
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 0
  },
  graphData: {
    type: Array,
    default: []
  }
});

const selectedRange = defineModel<[number, number]>({
  default: (props) => [Number(props.min), Number(props.max)]
})

</script>

<style lang="scss">
:where(.m-range-slider) {
  --track-empty-color:
    light-dark(var(--monochrome-700), var(--monochrome-200));
  --track-fill-color:
    light-dark(var(--secondary-300), var(--secondary-500));
  --track-thumb-color:
    light-dark(var(--secondary-500), var(--secondary-300));
  --track-thumb-border:
    2px solid light-dark(var(--secondary-300), var(--secondary-500));
}

.m-range-slider {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  gap: var(--size-12);
}

:where(.m-range-slider) {
  margin: 0;
}

.m-range-slider-graph {
  --thumb-size: var(--size-32);

  position: absolute;
  bottom: var(--size-16);
  left: calc(var(--thumb-size) / 2);
  width: calc(100% - var(--thumb-size));
  height: auto;
}

.m-range-slider-label-min,
.m-range-slider-label-max {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--size-32);
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

  @supports (field-sizing: content) {
    field-sizing: content;
    width: auto;
  }
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
  height: var(--size-32);
  flex-shrink: 1;
}

.m-range-slider-track {
  position: relative;
  background: var(--track-empty-color);
  flex-grow: 1;
  height: var(--size-6);
  border-radius: var(--border-radius-ui);
}

.m-range-slider-range {
  position: absolute;
  border-radius: var(--border-radius-pill);
  background: var(--track-fill-color);
  height: 100%;
}

.m-range-slider-thumb {
  display: block;
  width: var(--size-32);
  height: var(--size-32);
  background: var(--track-thumb-color);
  border: var(--track-thumb-border);
  border-radius: 100%;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}
</style>
