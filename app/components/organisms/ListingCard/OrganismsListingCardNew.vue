<template>
  <article
    v-if="listing.property && listing.property.address && listing.property.type && listing.property.classification && listing.property.createdAt && listing.user && listing.user.id && listing.user.username"
    class="m-listing-card" :data-tier="listing.listingTier === 'FEATURED' ? 'featured' : null"
    :aria-label="`Property listing: ${listing.property.type.name} in ${listing.property.address.fullAddress}`">
    <div v-if="listing.listingTier === 'FEATURED'" class="m-listing-card-featured-banner | body-sm font-bold" aria-label="Featured listing">
      Featured
    </div>
    <OrganismsListingCardNewImage :images="image_urls" :listing-id="listing.id" />
    <div class="m-listing-card-content">
      <div class="m-listing-card-details">
        <div class="m-listing-card-header-row m-listing-card-price-group">
          <AtomsListingCardNewHeader :price="listing.price" :price-type="priceType" />
          <span v-if="listing.rentalListing" class="m-listing-card-type-indicator | body-xs" aria-label="Property for rent">Rent</span>
          <span v-else-if="listing.saleListing" class="m-listing-card-type-indicator | body-xs" aria-label="Property for sale">Sale</span>
        </div>
        <AtomsListingCardNewTitle v-if="listing.property?.address" :address="listing.property.address"
          :type="listing.property.type.name" :classification="listing.property.classification.name" />
        <AtomsListingCardNewFeatures :bedrooms="listing.property.numberBedrooms"
          :bathrooms="listing.property.numberBathrooms" :receptions="listing.property.numberReceptions" />
        <AtomsListingCardNewTags :chain-free="listing.property.chainFree" :listed-date="listing.property.createdAt"
          :reduced="true" />
      </div>
      <div class="m-listing-card-footer">
        <AtomsListingCardNewAgent :username="listing.user.username" :id="listing.user.id" />
        <AtomsListingCardNewActions :listing-id="listing.id" :user-id="listing.user.id" />
      </div>
    </div>
  </article>
</template>

<script lang="ts" setup>

interface Props {
  listing: ListingWithFullProperty;
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

  &[data-tier='featured'] {
    border-color: var(--secondary-400);
    border-width: var(--size-4);
    padding: 0;

    .m-listing-card-image-container {
      border-radius: calc(var(--border-radius-2xl) - var(--size-1));
    }

    .m-listing-card-content {
      padding: var(--card-padding);
    }

    .m-listing-card-featured-banner {
      background-color: var(--secondary-400);
      border-radius: calc(var(--border-radius-2xl) - var(--size-4)) 0 var(--border-radius-lg) 0;
      color: var(--monochrome-900);
      padding: var(--size-8) var(--size-24);
      position: absolute;
      top: 0;
      left: -2px;
      z-index: 3;
    }
  }

  .m-listing-card-content {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--card-padding);
    width: calc(100% - var(--image-width));
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

    &[data-tier='featured'] {
      .m-listing-card-content {
        padding: var(--card-padding);
      }
    }

    .m-listing-card-content {
      width: 100%;
      padding: var(--card-padding);
    }
  }
}

@media (max-width: 768px) {
  .m-listing-card {
    .m-listing-card-content {
      width: 100%;
    }
  }
}
</style>