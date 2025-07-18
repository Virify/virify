<template>
  <!-- Base listing card component with flexible slot system for customization -->
  <div class="m-listing-card" :data-tier="listing.listingTier">
    <!-- Optional featured banner slot (used for premium/featured indicators) -->
    <slot name="featured-banner" />

    <!-- Image slot with default property image component -->
    <slot name="image">
      <OrganismsListingCardNewImage
        :images="image_urls"
        :listing-id="listing.id"
      />
    </slot>

    <div class="m-listing-card-content-wrapper">
      <!-- Premium Header  -->
      <slot name="premium-header" />
      <div class="m-listing-card-content">
        <!-- Main listing details section -->
        <div class="m-listing-card-details">
          <!-- Price and listing type indicator row -->
          <div class="m-listing-card-header-row m-listing-card-price-group">
            <slot name="header">
              <AtomsListingCardNewHeader
                :price="listing.price"
                :price-type="priceType"
              />
            </slot>
            <span
              v-if="listing.rentalListing"
              class="m-listing-card-type-indicator | body-xs"
              >Rent</span
            >
            <span
              v-else-if="listing.saleListing"
              class="m-listing-card-type-indicator | body-xs"
              >Sale</span
            >
          </div>

          <!-- Property title with address, type, and classification -->
          <slot name="title">
            <AtomsListingCardNewTitle
              :address="listing.property.address"
              :type="listing.property.type.name"
              :classification="listing.property.classification.name"
            />
          </slot>

          <!-- Property features (bedrooms, bathrooms, receptions) -->
          <slot name="features">
            <AtomsListingCardNewFeatures
              :bedrooms="listing.property.numberBedrooms"
              :bathrooms="listing.property.numberBathrooms"
              :receptions="listing.property.numberReceptions"
            />
          </slot>

          <!-- Property tags (chain-free, listing date, reduced status) -->
          <slot name="tags">
            <AtomsListingCardNewTags
              :chain-free="listing.property.chainFree"
              :listed-date="listing.property.createdAt"
              :reduced="true"
            />
          </slot>

          <!-- Description slot -->
          <slot name="description" />

          <!-- Mobile-only content slot -->
          <div class="m-listing-card-mobile-content">
            <slot name="mobile-content" />
          </div>

          <!-- Agent info -->
          <slot name="agent">
            <AtomsListingCardNewAgent
              :username="listing.user.username"
              :id="listing.user.id"
            />
          </slot>

          <!-- Actions slot with default view/enquire buttons -->
          <slot name="actions">
            <div class="m-listing-card-actions">
              <OrganismsListingCardNewView :listing-id="listing.id" />
              <AtomsListingCardNewEnquire
                :listing-id="listing.id"
                :user-id="listing.user.id"
              />
            </div>
          </slot>

          <!-- Mobile actions slot -->
          <div class="m-listing-card-mobile-actions">
            <slot name="mobile-actions" />
          </div>
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
const props = defineProps<Props>();

const image_urls = computed(() => {
  return props.listing.property?.media?.map((m: any) => m.image) ?? [];
});

const priceType = computed(() => {
  return (
    props.listing?.rentalListing?.rentFrequency ??
    props.listing?.saleListing?.priceType
  );
});
</script>

<style lang="scss" scoped>
.m-listing-card {
  --card-padding: var(--size-16);

  background-color: var(--background-200);
  border: 2px solid var(--foreground-100);
  border-radius: calc(var(--border-radius-2xl) + var(--size-2));
  display: flex;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .m-listing-card-content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: space-between;
  }

  .m-listing-card-content {
    color: var(--text-color);
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: var(--card-padding);
  }

  .m-listing-card-details {
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    height: 100%;
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
    background-color: var(--blue-400);
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-900);
  }

  .m-listing-card-mobile-content,
  .m-listing-card-mobile-actions {
    width: 100%;

    @media (min-width: 769px) {
      display: none;
    }
  }

  .m-listing-card-mobile-content:empty,
  .m-listing-card-mobile-actions:empty {
    display: none;
  }

  &:not([data-tier="FEATURED"]):not([data-tier="PREMIUM"]) {
    .a-favourite-button,
    .note-button {
      color: white;
    }
    
    .a-favourite-button svg {
      stroke: white;
    }
    
    .note-button-icon {
      color: white;
    }
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
    height: 100%;
    padding: 0;

    .m-listing-card-content-wrapper {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      width: 100% !important;
      height: 100%;
    }
  }

}
</style>
