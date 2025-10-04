<template>
  <MoleculesCardTemplate variant="premium" :result>
    <template #carousel="{ media, propertyId }">
      <MoleculesCardSlotsPremiumCarousel :slides="media" :property-id />
    </template>

    <template
      #content="{ price, priceGuide, propertyType, fullAddress, roomCounts, pills, propertyId, description, premiumFeatures }">
      <MoleculesCardSlotsViewLink :property-id>
        <span class="m-card-premium__spotlight-title | title-sm">Spotlight</span>
      </MoleculesCardSlotsViewLink>

      <div class="m-card-premium__grid">
        <div class="m-card-premium__grid-row">
          <MoleculesCardSlotsViewLink :property-id>
            <MoleculesCardSlotsPrice :price :price-guide />
            <MoleculesCardSlotsOverview :property-type :full-address />
            <MoleculesCardSlotsIcons :room-counts />
          </MoleculesCardSlotsViewLink>

          <MoleculesCardSlotsPills v-if="pills.length" :pills />

          <template v-if="isMobile">
            <MoleculesCardSlotsAccordion>
              <MoleculesCardSlotsDescription v-if="description" :description />
              <MoleculesCardSlotsChecklist v-if="premiumFeatures?.length" :list="premiumFeatures" />
            </MoleculesCardSlotsAccordion>
          </template>

          <template v-else>
            <MoleculesCardSlotsDescription if="description" :description />
          </template>
        </div>

        <template v-if="!isMobile">
          <div class="m-card-premium__grid-row">
            <MoleculesCardSlotsChecklist v-if="premiumFeatures?.length" :list="premiumFeatures" />
          </div>
        </template>
      </div>

      <MoleculesCardSlotsBookmark :property-id />
    </template>
  </MoleculesCardTemplate>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

interface Props {
  result: ListingCardData
}

defineProps<Props>()

/**
 *  Toggle mobile layout
 */
const isMobile = useMediaQuery('(max-width: 595px)')

</script>

<style lang="scss">
.m-card-premium {
  &__spotlight-title {
    display: flex;
    align-items: center;
    gap: var(--size-16);
    padding: var(--size-8) 0;
    padding-right: var(--size-64);
    margin: 0 auto var(--size-24);

    @container listing-card-content (width > 600px) {
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

    @container listing-card-content (width <=600px) {
      .m-card-slots-checklist__row:nth-child(n+7) {
        display: none;
      }
    }

    @container listing-card-content (width > 600px) {
      align-items: center;
      grid-template-columns: 1fr 1.1fr;
      column-gap: var(--size-40);
    }
  }

  @container listing-card (width < 550px) {

    &__spotlight-title {
      display: none;
    }

    &__grid {

      .m-card-slots-overview,
      .m-cards-slots-price {
        margin-right: var(--size-56)
      }
    }
  }
}
</style>
