<template>
  <div class="m-listing-card" :data-tier="listing.listingTier === 'FEATURED' ? 'featured' : null">
    <div v-if="listing.listingTier === 'FEATURED'" class="m-listing-card-featured-banner | body-sm font-bold">
      Featured
    </div>
    <MoleculesListingCardNewImage :images="images" />
    <div class="m-listing-card-content">
      <div class="m-listing-card-details">
        <MoleculesListingCardNewHeader />
        <MoleculesListingCardNewTitle />
        <MoleculesListingCardNewFeatures />
        <MoleculesListingCardNewTags />
      </div>
      <div class="m-listing-card-footer">
        <MoleculesListingCardNewAgent />
        <MoleculesListingCardNewActions />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  images: {
    type: Array as () => string[],
    default: () => [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ]
  },
  title: {
    type: String,
    default: 'Detached House'
  },
  listing_tier: {
    type: String,
    default: ''
  },
  listing: {
    type: Object as () => ListingWithFullProperty,
    default: () => ({})
  }
})

onMounted(() => {
  console.log(props.listing)
})
</script>

<style lang="scss">
.m-listing-card {
  --card-padding: var(--size-16);
  --image-width: 45%;

  background-color: var(--background-100);
  border: 1px solid var(--foreground-100);
  border-radius: var(--border-radius-2xl);
  display: flex;
  max-width: 960px;
  position: relative;

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