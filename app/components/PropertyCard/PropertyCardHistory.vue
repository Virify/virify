<template>
  <div class="property-card-history">
    <PopoverRoot>
      <PopoverTrigger class="property-card-history__button | body-xs">
        <AtomsIcon :icon="iconName" />

        Price {{ reducedOrChanged }}
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent class="property-card-history__popover | gradient-box body-sm" align="start" :align-offset="0"
          :side-offset="4" :collision-padding="{ bottom: 100 }" :style="{ width: cardWidthWithUnits }">
          <p class="property-card-history__notice | body-2xs">
            <AtomsIcon icon="property/info" />
            Price changes for the property since it was initially listed
            on Virify
          </p>

          <MoleculesPriceChangeTable class="property-card-history__table" :prices="historic" :current-price="current" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>

<script setup lang="ts">
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'

interface Props {
  historic?: Record<string, unknown>[]
  current?: number
  cardWidth: number
}

const props = defineProps<Props>()

/**
 *  Price history
 */
const changePercent = computed<string | false>(() => {
  const { historic = [], current } = props

  // If no historic prices or current price number
  if (!historic?.length || !current) return false

  // Get current, historic prices
  const [recentPrice] = asArray(historic)

  // Get old price
  const { oldPrice } = asObject(recentPrice)

  // Return false if no old price number exists
  const oldPriceNumber = Number(oldPrice)
  const newPriceNumber = Number(current)

  // If either value is not a number, show no change
  if (!oldPriceNumber || !newPriceNumber) return false

  // Return price different as a percentage
  return (100 * (1 - (oldPriceNumber / newPriceNumber))).toFixed(1)
})

/**
 *  Other content
 */
const reducedOrChanged = computed<'reduced' | 'increased' | null>(() => {
  if (Number(changePercent.value) > 0) {
    return 'increased'
  }

  return 'reduced'
})

const iconName = computed<'search/trend-up' | 'search/trend-down'>(() => {
  if (reducedOrChanged.value === 'reduced') {
    return 'search/trend-down'
  }

  return 'search/trend-up'
})

/**
 *  Get width for wrapper
 */
const cardWidthWithUnits = computed(() => {
  const widthNumber = Number(props.cardWidth)

  return widthNumber ? (widthNumber - 20) + 'px' : '28vw'
})

</script>

<style lang="scss">
.property-card-history {
  padding: var(--size-10);
  padding-right: var(--size-4);
  padding-bottom: var(--size-4);


  &__button {
    display: flex;
    align-items: center;
    gap: var(--size-6);
    width: fit-content;
    background: var(--primary-400);
    color: var(--monochrome-900);
    border-radius: var(--border-radius-pill);
    padding: var(--size-4) var(--size-12);
    padding-left: var(--size-8);
    white-space: nowrap;
    font-weight: var(--font-semisemibold);
    cursor: pointer;
    transition: background-color var(--animation-fast);

    &:hover {
      background: var(--primary-500);
    }

    .a-icon {
      display: block;
      width: var(--size-18);
      height: var(--size-18);
    }
  }

  &__popover {
    --gradient-box-radius: var(--border-radius-xl);

    display: flex;
    flex-direction: column;
    gap: var(--size-10);
    padding: var(--size-10);
    background: var(--background-200);
    min-width: 20ch;
    transform-origin: 0 0;

    &[data-side="top"] {
      transform-origin: 0 100%;
    }

    @media (prefers-reduced-motion: no-preference) {
      animation: fadeDownPriceHistory var(--animation-fast) var(--ease-in-out);

      &[data-side="top"] {
        animation: fadeUpPriceHistory var(--animation-fast) var(--ease-in-out);
      }
    }
  }

  &__table {
    overflow: auto;
  }

  &__notice {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--size-8);
    padding: var(--size-10) var(--size-8);
    padding-right: var(--size-12);
    border-radius: var(--border-radius-lg);
    background: light-dark(var(--notice-200), var(--notice-800));
    color: light-dark(var(--monochrome-100), var(--monochrome-900));
    font-weight: var(--font-semibold);
    line-height: var(--size-18);

    .a-icon {
      display: block;
      color: light-dark(var(--notice-500), var(--monochrome-900));
      width: var(--size-20);
      height: var(--size-20);

      // Hacky fix to match line-height of paragraph, which is 18px to
      // the 20px of the icon (so offset by 1px to align)
      margin-top: -1px;
    }
  }
}

@keyframes fadeUpPriceHistory {
  from {
    opacity: 0;
    translate: 0 var(--size-12);
  }
}

@keyframes fadeDownPriceHistory {
  from {
    opacity: 0;
    translate: 0 calc(0px - var(--size-12));
  }
}
</style>