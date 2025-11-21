<template>
  <MoleculesCardTemplate variant="premium" :result>
    <template #carousel="{ media, propertyId }">
      <MoleculesCardSlotsPremiumCarousel :slides="media" :property-id />
    </template>

    <template
      #content="{ price, priceGuide, propertyType, fullAddress, roomCounts, pills, propertyId, description, premiumFeatures }">
      <MoleculesCardSlotsViewLink :property-id>
        <span class="m-card-premium__title | title-sm">Spotlight</span>
      </MoleculesCardSlotsViewLink>

      <div class="m-card-premium__grid">
        <div class="m-card-premium__grid-row">
          <MoleculesCardSlotsViewLink :property-id>
            <MoleculesCardSlotsPrice :price :price-guide />
            <MoleculesCardSlotsOverview :property-type :full-address />
            <MoleculesCardSlotsIcons :room-counts />
          </MoleculesCardSlotsViewLink>

          <MoleculesCardSlotsPills v-if="pills.length" :pills />

          <MoleculesCardSlotsDescription v-if="description" :description="result.property.description" />
        </div>

        <div class="m-card-premium__grid-row">
          <MoleculesCardSlotsChecklist v-if="premiumFeatures?.length" :list="premiumFeatures" />
        </div>
      </div>

      <MoleculesCardSlotsBookmark :property-id />
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
  &__title {
    display: flex;
    align-items: center;
    gap: var(--size-16);
    padding: var(--size-8) 0;
    padding-right: var(--size-36);
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

  &__grid {
    display: grid;
    gap: var(--size-12);

    @container (width <=600px) {
      .m-card-slots-checklist__row:nth-child(n+7) {
        display: none;
      }
    }

    @container (width > 600px) {
      align-items: center;
      grid-template-columns: 1fr 1.1fr;
      column-gap: var(--size-40);
    }
  }
}
</style>
