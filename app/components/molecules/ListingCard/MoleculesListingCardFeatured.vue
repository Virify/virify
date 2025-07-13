<template>
  <MoleculesListingCardBase :listing="listing">
    <template #featured-banner>
      <div class="m-listing-card-featured-banner | body-sm font-bold">
        Featured
      </div>
    </template>
  </MoleculesListingCardBase>
</template>

<script lang="ts" setup>

interface Props {
  listing: ListingCardData;
}
defineProps<Props>()
</script>

<style lang="scss">
.m-listing-card[data-tier='FEATURED'] {
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

@media (max-width: 1200px) {
  .m-listing-card[data-tier='FEATURED'] {
    .m-listing-card-content {
      padding: var(--card-padding);
    }
  }
}
</style>