<template>
  <div class="a-listing-status-badges">
    <PropertyCardHistory
      v-if="priceHistory?.length && currentPriceNumber"
      :historic="(priceHistory as Record<string, unknown>[])"
      :current="currentPriceNumber"
      :inline="true"
    />
    <ClientOnly>
      <UBadge
        v-if="openHouseBadgeLabel"
        :label="openHouseBadgeLabel"
        icon="i-lucide-door-open"
        size="md"
        color="info"
        variant="solid"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface Props {
  priceHistory?: PriceHistoryEntry[] | null;
  currentPriceNumber?: number | null;
  openHouseBadgeLabel?: string | null;
}

defineProps<Props>();
</script>

<style lang="scss">
.a-listing-status-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--size-8);
}
</style>
