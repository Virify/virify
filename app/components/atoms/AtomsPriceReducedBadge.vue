<template>
  <UBadge
    v-if="isReduced"
    v-bind="$attrs"
    label="Price Reduced"
    icon="i-lucide-trending-down"
    size="md"
    color="secondary"
    variant="solid"
  />
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

interface Props {
  priceHistory?: PriceHistoryEntry[] | null;
  currentPrice?: number | null;
}

const props = defineProps<Props>();

/**
 * Only show the "Price Reduced" badge when the current price is strictly lower
 * than the price set just before the most recent change (priceHistory[0], desc order).
 * This prevents the badge showing when an old reduction was later reversed by an increase.
 */
const isReduced = computed(() => {
  const { priceHistory, currentPrice } = props;
  if (!priceHistory?.length || !currentPrice) return false;
  // priceHistory is ordered desc, so [0] is the most recent change.
  // oldPrice is the price before that change was made.
  const lastEntry = priceHistory[0];
  return !!lastEntry && currentPrice < lastEntry.oldPrice;
});
</script>
