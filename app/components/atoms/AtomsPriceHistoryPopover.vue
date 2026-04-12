<template>
  <UPopover v-if="priceHistory?.length" mode="click" :content="{ side: 'bottom', align: 'start' }">
    <UButton
      icon="i-lucide-clock"
      size="xs"
      color="warning"
      variant="ghost"
      aria-label="View price history"
      class="atoms-price-history-popover__trigger"
    />

    <template #content>
      <div class="atoms-price-history-popover">
        <p class="atoms-price-history-popover__heading | body-sm">Price history</p>

        <!-- Current price -->
        <div class="atoms-price-history-popover__row atoms-price-history-popover__row">
          <span class="body-xs">Now</span>
          <span class="body-xs font-bold">{{ numberToCurrency(currentPrice, true) }}</span>
        </div>

        <USeparator class="atoms-price-history-popover__separator" />

        <!-- History entries (desc order: newest first) -->
        <div
          v-for="entry in priceHistory"
          :key="entry.id"
          class="atoms-price-history-popover__row"
        >
          <span class="body-xs text-muted">{{ formatHistoryDate(entry.createdAt) }}</span>
          <div class="atoms-price-history-popover__value">
            <span class="body-xs font-bold">{{ numberToCurrency(entry.oldPrice, true) }}</span>
            <UBadge
              :label="`${entryChangePct(entry) < 0 ? '↓' : '↑'} ${Math.abs(entryChangePct(entry)).toFixed(1)}%`"
              size="sm"
              class="body-xs font-bold"
              :color="entryChangePct(entry) < 0 ? 'success' : 'error'"
              variant="subtle"
            />
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
interface Props {
  priceHistory: PriceHistoryEntry[]
  currentPrice: number
}

const props = defineProps<Props>()

function formatHistoryDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Percentage change for a history entry: negative = reduced, positive = increased */
function entryChangePct(entry: PriceHistoryEntry): number {
  return ((entry.newPrice - entry.oldPrice) / entry.oldPrice) * 100
}
</script>

<style lang="scss">
.atoms-price-history-popover {
  min-width: 14rem;
  padding: var(--size-12);
  display: flex;
  flex-direction: column;
  gap: var(--size-6);

  &__trigger {
    vertical-align: middle;
  }

  &__heading {
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }

  &__separator {
    margin-block: var(--size-2);
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-16);
  }

  &__value {
    display: flex;
    align-items: center;
    gap: var(--size-6);
  }
}
</style>
