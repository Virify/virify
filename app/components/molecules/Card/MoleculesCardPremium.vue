<template>
  <MoleculesCardTemplate variant="premium" :result>
    <template #carousel>
      Carousel (Premium)
    </template>

    <template #content="{ price, priceGuide, propertyType, fullAddress, roomCounts, pills, propertyId }">
      <MoleculesCardSlotsViewLink :property-id>
        <span class="m-card-premium | title-sm">Spotlight</span>

        <MoleculesCardSlotsPrice :price :price-guide />
        <MoleculesCardSlotsOverview :property-type :full-address />
        <MoleculesCardSlotsIcons :room-counts />
      </MoleculesCardSlotsViewLink>

      <MoleculesCardSlotsPills v-if="pills.length" :pills />
    </template>
  </MoleculesCardTemplate>
</template>

<script setup lang="ts">
interface Props {
  result: ListingCardData
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-premium {
  display: flex;
  align-items: center;
  gap: var(--size-16);
  padding: var(--size-8) 0;
  margin: 0 auto var(--size-24);

  @container (width > 600px) {
    max-width: min(26ch, 100% - var(--size-48));
  }

  &::before,
  &::after {
    content: '';
    height: 1px;
    background: currentColor;
    min-width: 1ch;
    flex-grow: 1;
  }
}
</style>
