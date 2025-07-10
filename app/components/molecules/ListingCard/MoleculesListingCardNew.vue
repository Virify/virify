<template>
  <div class="m-listing-card" :data-tier="listing.listingTier === 'FEATURED' ? 'featured' : null">
    <div v-if="listing.listingTier === 'FEATURED'" class="m-listing-card-featured-banner | body-sm font-bold">
      Featured
    </div>
    <MoleculesListingCardNewImage :images="image_urls" :listing-id="listing.id" />
    <div class="m-listing-card-content">
      <div class="m-listing-card-details">
        <MoleculesListingCardNewHeader :price="listing.price" :price-type="priceType" />
        <MoleculesListingCardNewTitle v-if="listing.property?.address" :address="listing.property.address"
          :type="listing.property?.type.name" :classification="listing.property?.classification.name" />
        <MoleculesListingCardNewFeatures :bedrooms="listing.property?.numberBedrooms"
          :bathrooms="listing.property?.numberBathrooms" :receptions="listing.property?.numberReceptions" />
        <MoleculesListingCardNewTags :chain-free="listing.property?.chainFree"
          :listed-date="listing.property?.createdAt!" :reduced="true" />
      </div>
      <div class="m-listing-card-footer">
        <MoleculesListingCardNewAgent :username="(userName as string)" :id="listing.user?.id!" />
        <MoleculesListingCardNewActions :listing-id="listing.id" />
      </div>
    </div>
  </div>
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

const userName = computed(() => {
  return props.listing.user?.username ?? props.listing.user?.email;
});
</script>

<style lang="scss">
.m-listing-card {
  --card-padding: var(--size-16);
  --image-width: 45%;

  background-color: var(--background-200);
  border: 1px solid var(--foreground-100);
  border-radius: var(--border-radius-2xl);
  display: flex;
  max-width: 960px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &[data-tier='featured'] {
    border-color: var(--secondary-400);
    border-width: var(--size-4);
    padding: 0;

    .m-listing-card-image-container {
      border-radius: var(--border-radius-2xl)
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