<template>
  <ul class="m-price-change-table">
    <li class="m-price-change-table__row | gradient-box">
      <span class="m-price-change-table__price | title-2xs">
        {{ currentPriceFormatted }}
      </span>

      <div class="m-price-change-table__footer">
        <span class="m-price-change-table__pill m-price-change-table__pill--action">
          Current price
        </span>
      </div>
    </li>

    <li v-for="{
      key,
      price,
      trend,
      trendIcon,
      percent,
      date,
      dateISO,
      isInitial,
    } of pricesFormatted" :key class="m-price-change-table__row | gradient-box">
      <span class="m-price-change-table__price | title-2xs">
        {{ price }}
      </span>

      <div class="m-price-change-table__footer">
        <span class="m-price-change-table__pill m-price-change-table__pill--trend" :class="{
          'm-price-change-table__pill--trend-up': trend === 'up',
          'm-price-change-table__pill--trend-down': trend === 'down',
        }">
          <AtomsIcon :icon="trendIcon" />

          {{ percent }}
        </span>

        <span v-if="isInitial" class="m-price-change-table__pill m-price-change-table__pill--action">
          Initial price
        </span>

        <time v-if="dateISO" :datetime="dateISO" class="m-price-change-table__pill m-price-change-table__pill--date">
          <AtomsIcon icon="search/history" />

          {{ date }}
        </time>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface PriceRow {
  [key: string]: unknown;
}

interface Props {
  prices?: PriceRow[];
  currentPrice?: number;
}

const props = defineProps<Props>();

/**
 *  Format prices
 */
const currentPriceFormatted = computed(() => {
  const currentPriceNumber = Number(props.currentPrice);

  return numberToCurrency(currentPriceNumber);
});

const pricesFormatted = computed(() => {
  const { prices } = props;

  // Ensure is array
  const pricesArray = asArray(prices)

  // Map and format
  return pricesArray.map((row: PriceRow, index) => {
    const { id, oldPrice, changePercent, createdAt } = asObject(row);

    // Check if date is valid
    const dateISO = Date.parse(createdAt as string) && String(createdAt);
    const date = dateISO && getSmartTimeAgo(dateISO);

    // Get items in correct format
    const key = Number(id);
    const changePercentNumber = Number(changePercent);
    const price = numberToCurrency(Number(oldPrice));
    const percent = changePercentNumber.toFixed(1) + "%";
    const isInitial = index === pricesArray.length - 1;
    const isTrendUp = changePercentNumber > 0;
    const trend = isTrendUp ? "up" : "down";
    const trendIcon = isTrendUp ? "search/trend-up" : "search/trend-down";

    return {
      key,
      price,
      percent,
      trend,
      trendIcon,
      date,
      dateISO,
      isInitial,
    };
  });
});
</script>

<style lang="scss">
.m-price-change-table {
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
  max-height: min(80vh, 24em);
  overflow: auto;
  scrollbar-width: thin;

  &__row {
    --gradient-box-radius: var(--border-radius-lg);

    padding: var(--size-12);
    background: var(--background-200);
  }

  &__price {
    display: block;
    margin: 0;
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-4);
    align-items: stretch;
    margin: var(--size-6) 0 0;
  }

  &__pill {
    display: flex;
    align-items: center;
    white-space: nowrap;
    gap: var(--size-2);
    font-weight: var(--font-semisemibold);
    font-size: var(--font-2xs);
    line-height: var(--lineheight-sm);
    width: fit-content;
    padding: var(--size-4) var(--size-12);
    border-radius: var(--border-radius-pill);
    background: light-dark(var(--blue-800), var(--blue-200));

    &:has(.a-icon) {
      padding-left: var(--size-6);
    }

    .a-icon {
      display: block;
      width: var(--size-16);
      height: var(--size-16);
    }

    &--trend-up {
      background: light-dark(var(--error-800), var(--error-300));
      color: light-dark(var(--error-400), var(--monochrome-900));
    }

    &--trend-down {
      background: light-dark(var(--success-800), var(--success-300));
      color: light-dark(var(--success-300), var(--monochrome-900));
    }

    &--action {
      background: light-dark(var(--primary-900), var(--primary-400));
      color: light-dark(var(--primary-400), var(--monochrome-900));
      font-weight: var(--font-semibold);
    }
  }
}
</style>
