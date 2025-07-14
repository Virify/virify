<template>
  <div class="m-listing-card" :data-tier="listing.listingTier">
    <slot name="featured-banner" />
    <slot name="image">
      <MoleculesListingCardNewImage :images="image_urls" :listing-id="listing.id" />
    </slot>
    <div class="m-listing-card-content-wrapper">
      <slot name="content-header" />
      <div class="m-listing-card-content">
        <div class="m-listing-card-details">
          <div class="m-listing-card-header-row m-listing-card-price-group">
            <MoleculesListingCardNewHeader :price="listing.price" :price-type="priceType" />
            <span v-if="listing.rentalListing" class="m-listing-card-type-indicator | body-xs">Rent</span>
            <span v-else-if="listing.saleListing" class="m-listing-card-type-indicator | body-xs">Sale</span>
          </div>
          <MoleculesListingCardNewTitle :address="listing.property.address"
            :type="listing.property.type.name" :classification="listing.property.classification.name" />
          <MoleculesListingCardNewFeatures :bedrooms="listing.property.numberBedrooms"
            :bathrooms="listing.property.numberBathrooms" :receptions="listing.property.numberReceptions" />
          <MoleculesListingCardNewTags :chain-free="listing.property.chainFree" :listed-date="listing.property.createdAt"
            :reduced="true" />
        </div>
        <div class="m-listing-card-footer">
          <MoleculesListingCardNewAgent :username="listing.user.username" :id="listing.user.id" />
          <slot name="actions">
            <div class="m-listing-card-actions">
              <!-- Placeholder for additional actions if needed -->
              <MoleculesListingCardNewView :listing-id="listing.id" />
              <MoleculesListingCardNewEnquire :listing-id="listing.id" :user-id="listing.user.id" />
            </div>
            
          </slot>
        </div>
      </div>
      <slot name="additional-content" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  listing: ListingCardData;
}
const props = defineProps<Props>()

const image_urls = computed(() => {
  return props.listing.property?.media?.map((m: any) => m.image) ?? []
})

const priceType = computed(() => {
  return props.listing?.rentalListing?.rentFrequency ?? props.listing?.saleListing?.priceType;
});
</script>

<style lang="scss">
.m-listing-card {
  --card-padding: var(--size-16);
  --image-width: 45%;

  background-color: var(--background-200);
  border: 1px solid var(--foreground-100);
  border-radius: calc(var(--border-radius-2xl) + var(--size-2));
  display: flex;
  max-width: 960px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .m-listing-card-content-wrapper {
    display: flex;
    flex-direction: column;
    width: calc(100% - var(--image-width));
  }

  .m-listing-card-content {
    color: var(--text-color);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--card-padding);
  }

  .m-listing-card-footer {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    justify-content: space-between;
  }

  .m-listing-card-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--size-8);
    margin-bottom: var(--size-8);
  }

  .m-listing-card-price-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--size-12);
  }

  .m-listing-card-type-indicator {
    min-width: 60px;
    text-align: center;
    padding-right: var(--size-8);
    background-color: var(--background-300);
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
  }
}

@media (max-width: 1200px) {
  .m-listing-card {
    flex-direction: column;
    max-width: 100%;
    padding: 0;

    .m-listing-card-content-wrapper {
      width: 100%;
    }
    
    .m-listing-card-content {
      padding: var(--card-padding);
    }
  }
}

@media (max-width: 768px) {
  .m-listing-card {
    .m-listing-card-content-wrapper {
      width: 100%;
    }
  }
}
</style>