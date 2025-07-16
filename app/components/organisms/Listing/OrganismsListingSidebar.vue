<template>
  <section role="presentation" class="o-listing-sidebar | flow flow-md">
    <h2 v-if="price" class="o-listing-sidebar__title | title-2xl lineheight-xs">
      <AtomsPill class="o-listing-sidebar__title-offertype | body-xs">
        Offers in excess of
      </AtomsPill>

      {{ price }}
    </h2>

    <p role="presentation" class="o-listing-sidebar__address | body-md font-bold">
      {{ address }}
    </p>

    <OrganismsListingSidebarIcons 
      :property-type="propertyType"
      :price="priceNumber"
      :bedrooms="bedrooms"
      :bathrooms="bathrooms"
      :receptions="receptions"
      :ownership="ownership"
    />

      <OrganismsListingSidebarPills 
      :property-size="propertySize"
      :construction-type="constructionType"
      :chain-free="chainFree"
      :vacant="vacant"
      :year-built="yearBuilt"
    />

    <OrganismsListingButtons :listing-id="listingId" enquire-url="#" />
    <OrganismsListingAgent />
  </section>
</template>

<script setup lang="ts">
interface Props {
  price?: string
  listingId: number
  address?: string
  propertyType?: string
  propertySize?: number
  priceNumber?: number
  bedrooms?: number
  bathrooms?: number
  receptions?: number
  ownership?: string
  yearBuilt?: string
  constructionType?: string
  chainFree?: boolean
  vacant?: boolean
}

defineProps<Props>()

</script>

<style lang="scss">
.o-listing-sidebar {
  max-width: 20em;

  &__title {
    margin-bottom: 0;
  }

  &__title-offertype {
    display: block;
    text-align: left;
    margin-bottom: var(--size-4);
    background: var(--blue-400);
    color: var(--monochrome-900);
  }

  &__address {
    margin: 0;
    color: var(--secondary-400);
  }
}
</style>