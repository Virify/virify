<template>
  <!-- Base listing card component with flexible slot system for customization -->
  <div class="m-listing-card" :data-tier="listing.listingTier">
    <!-- Optional featured banner slot (used for premium/featured indicators) -->
    <slot name="featured-banner" />
    
    <!-- Image slot with default property image component -->
    <slot name="image">
      <MoleculesListingCardNewImage :images="image_urls" :listing-id="listing.id" />
    </slot>
    
    <div class="m-listing-card-content-wrapper">
      <!-- Premium Header  -->
      <slot name="premium-header" />
      
      <div class="m-listing-card-content">
        <!-- Main listing details section -->
        <div class="m-listing-card-details">
          <!-- Price and listing type indicator row -->
          <div class="m-listing-card-header-row m-listing-card-price-group">
            <MoleculesListingCardNewHeader :price="listing.price" :price-type="priceType" />
            <span v-if="listing.rentalListing" class="m-listing-card-type-indicator | body-xs">Rent</span>
            <span v-else-if="listing.saleListing" class="m-listing-card-type-indicator | body-xs">Sale</span>
          </div>
          
          <!-- Property title with address, type, and classification -->
          <MoleculesListingCardNewTitle :address="listing.property.address" :type="listing.property.type.name"
            :classification="listing.property.classification.name" />
          
          <!-- Property features (bedrooms, bathrooms, receptions) -->
          <MoleculesListingCardNewFeatures :bedrooms="listing.property.numberBedrooms"
            :bathrooms="listing.property.numberBathrooms" :receptions="listing.property.numberReceptions" />
          
          <!-- Property tags (chain-free, listing date, reduced status) -->
          <MoleculesListingCardNewTags :chain-free="listing.property.chainFree"
            :listed-date="listing.property.createdAt" :reduced="true" />
        </div>
        
        <!-- Footer with agent info and action buttons -->
        <div class="m-listing-card-footer">
          <MoleculesListingCardNewAgent :username="listing.user.username" :id="listing.user.id" />
          
          <!-- Actions slot with default view/enquire buttons -->
          <slot name="actions">
            <div class="m-listing-card-actions">
              <MoleculesListingCardNewView :listing-id="listing.id" />
              <MoleculesListingCardNewEnquire :listing-id="listing.id" :user-id="listing.user.id" />
            </div>
          </slot>
        </div>
      </div>
      
      <!-- Optional additional content slot (for extra content below main card) -->
      <slot name="premium-content" />
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

<style lang="scss" scoped>
.m-listing-card {
  --card-padding: var(--size-16);

  background-color: var(--background-200);
  border: 1px solid var(--foreground-100);
  border-radius: calc(var(--border-radius-2xl) + var(--size-2));
  display: flex;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .m-listing-card-content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
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

  .m-listing-card-actions {
    display: grid;
    gap: var(--size-8);
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
  
  // Apply border-radius to all buttons within the card
  button,
  .button,
  span.button {
    border-radius: var(--border-radius-lg) !important;
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
    --image-width: 100%;
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
    flex-direction: column;
    max-width: 100%;
    padding: 0;

    .m-listing-card-content-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      width: 100% !important;
    }

    .m-listing-card-content {
      padding: var(--card-padding);
    }
  }
}
</style>