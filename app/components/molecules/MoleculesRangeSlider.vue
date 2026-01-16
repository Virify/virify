<template>
  <div class="m-range-slider | relative">
    <AtomsRangeGraph v-if="graphData.length" :min :max :range="selectedRange" :graph-data="!loading ? graphData : []"
      class="m-range-slider__graph" />

    <AtomsLabel class="m-range-slider__label-min">
      <AtomsCurrencyInput v-model="selectedRange[0]" name="minprice" class="m-range-slider__input | body-md" />
    </AtomsLabel>

    <AtomsLabel class="m-range-slider__label-max">
      <AtomsCurrencyInput v-model="selectedRange[1]" name="maxprice" class="m-range-slider__input | body-md" />
    </AtomsLabel>

    <SliderRoot v-model="selectedRange" :min="min" :max="max" class="m-range-slider__root">
      <SliderTrack class="m-range-slider__track">
        <SliderRange class="m-range-slider__range" />
      </SliderTrack>
      <SliderThumb class="m-range-slider__thumb" />
      <SliderThumb class="m-range-slider__thumb" />
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
  },
  loading: {
    type: Boolean,
    default: false
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

  &__graph {
    --thumb-size: var(--size-32);

    position: absolute;
    bottom: var(--size-16);
    left: calc(var(--thumb-size) / 2);
    width: calc(100% - var(--thumb-size));
    height: auto;
  }

  &__label-min,
  &__label-max {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: var(--size-32);
  }

  &__label-min {
    text-align: left;
    align-items: flex-start;
  }

  &__label-max {
    text-align: right;
    align-items: flex-end;
  }

  &__input {
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
  &__root {
    grid-column: span 2;
    position: relative;
    display: flex;
    align-items: center;
    user-select: none;
    touch-action: none;
    height: var(--size-32);
    flex-shrink: 1;
  }

  &__track {
    position: relative;
    background: var(--track-empty-color);
    flex-grow: 1;
    height: var(--size-6);
    border-radius: var(--border-radius-ui);
  }

  &__range {
    position: absolute;
    border-radius: var(--border-radius-pill);
    background: var(--track-fill-color);
    height: 100%;
  }

  &__thumb {
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
}

:where(.m-range-slider) {
  margin: 0;
}
</style>
