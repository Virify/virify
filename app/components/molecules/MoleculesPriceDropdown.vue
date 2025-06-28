<template>
  <div role="presentation" class="m-price-dropdown">
    <input type="button" class="m-price-dropdown__input | dynamic-input" :placeholder="placeholder"
      v-model="valueAsCurrency" readonly :popovertarget="popoverId" />

    <div class="m-price-dropdown__popover | flow flow-sm" popover :id="popoverId">
      <div class="m-price-dropdown__popover-labels | body-xs font-normal faded-text">
        <span class="m-price-dropdown__popover-label">
          Min {{ minCurrency }}
        </span>

        <span class="m-price-dropdown__popover-label">
          Max {{ maxCurrency }}
        </span>
      </div>

      <SliderRoot v-model="editableValue" :min :max :step class="m-price-dropdown__slider-root">

        <SliderTrack class="m-price-dropdown__slider-track">
          <SliderRange class="m-price-dropdown__slider-range" />
        </SliderTrack>

        <SliderThumb class="m-price-dropdown__slider-thumb" />
        <SliderThumb class="m-price-dropdown__slider-thumb" />
      </SliderRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from "reka-ui";

interface Props {
  placeholder: string,
  min?: number,
  max?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 5000000,
  step: 25000
})

/**
 *  Popover
 */
const popoverId = useId()

/**
 *  v-model directive
 */
const editableValue = defineModel({
  default: []
})

const valueAsCurrency = computed(() => {
  return unref(editableValue).map(numberToCurrency).join('-')
})

const minCurrency = computed(() => {
  return numberToCurrency(props.min)
})

const maxCurrency = computed(() => {
  return numberToCurrency(props.max)
})

</script>

<style lang="scss">
.m-price-dropdown {
  display: inline-block;
  position: relative;

  &__popover {
    overflow: visible;
    position: absolute;
    top: calc(anchor(bottom) + var(--size-10));
    left: anchor(left);
    background: var(--background-200);
    border: 1px solid var(--border-color-200);
    width: fit-content;
    min-width: 10ch;
    padding: var(--size-14) var(--size-16);
    box-sizing: border-box;
    border-radius: var(--border-radius-lg);

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      background: var(--background-200);
      border-top: 1px solid var(--border-color-200);
      border-left: 1px solid var(--border-color-200);
      border-top-left-radius: var(--border-radius-xs);
      position: absolute;
      top: -7px;
      left: 2.5ch;
      transform: rotate(45deg);
    }

    &-labels {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  /**
   *  Range slider styling
   */
  &__slider {

    &-root {
      position: relative;
      display: flex;
      align-items: center;
      user-select: none;
      touch-action: none;
      height: var(--size-32);
      width: 300px;
      flex-shrink: 1;
    }

    &-track {
      position: relative;
      background: light-dark(var(--monochrome-700), var(--monochrome-200));
      flex-grow: 1;
      height: var(--size-6);
      border-radius: var(--border-radius-ui);
    }

    &-range {
      position: absolute;
      border-radius: var(--border-radius-pill);
      background: light-dark(var(--secondary-300), var(--secondary-500));
      height: 100%;
    }

    &-thumb {
      display: block;
      width: var(--size-24);
      height: var(--size-24);
      background: light-dark(var(--secondary-500), var(--secondary-300));
      border: 2px solid light-dark(var(--secondary-300), var(--secondary-500));
      border-radius: 100%;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }
  }
}
</style>