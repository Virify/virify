<template>
  <div class="o-listing-overview">
    <h2 v-if="price" class="o-listing-overview__title | title-xl lineheight-xs">
      <div class="o-listing-overview__title-offertype">
        <AtomsPill class="o-listing-sidebar__title-offertype__item | body-xs">
          {{ convertEnumToString(priceType!) }}
        </AtomsPill>
        <AtomsPill class="o-listing-sidebar__title-offertype__item | body-xs">
          {{ convertEnumToString(available!) }}
        </AtomsPill>
      </div>


      <span class="o-listing-overview__price">{{ price }}</span>
    </h2>

    <p role="presentation" class="o-listing-overview__address | body-md">
      {{ address }}
    </p>

    <!-- Property Icons -->
    <div class="o-listing-overview__icons">
      <OrganismsListingSidebarIcons :property-type="propertyType" :bedrooms="bedrooms" :bathrooms="bathrooms"
        :receptions="receptions" :other-rooms="otherRooms" :has-garden="hasGarden" :has-land="hasLand"
        :classification="classification" />
    </div>

    <!-- Property Pills -->
    <div class="o-listing-overview__pills">
      <OrganismsListingSidebarPills :property-size="propertySize" :chain-free="chainFree" :year-built="yearBuilt"
        :construction-type="constructionType" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  price?: string
  address?: string
  priceType?: string
  propertyType?: string
  propertySize?: number
  bedrooms?: number
  bathrooms?: number
  receptions?: number
  otherRooms?: number
  classification?: string
  yearBuilt?: string
  constructionType?: string
  chainFree?: boolean | null
  hasGarden?: boolean
  hasLand?: boolean
  available?: string
}

const props = defineProps<Props>()
console.log("OrganismsListingOverview loaded with props:", props.address);
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-listing-overview {
  text-align: center;
  margin-top: 0;

  @include mq.notebook {
    text-align: left;
  }

  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-8);

    @include mq.notebook {
      align-items: flex-start;
      justify-content: flex-start;
    }
  }

  &__title-offertype {
    display: flex;
    gap: var(--size-8);
    text-align: left;
    margin-bottom: var(--size-4);

    &__item {
      background: var(--blue-400);
      color: var(--monochrome-900);
    }
  }

  &__price-type {
    background: var(--blue-400);
    color: var(--monochrome-900);
  }

  &__price {
    color: var(--foreground-100);
  }

  &__address {
    color: var(--primary-400);
    margin: 0;
    font-weight: 500;
    text-align: center;

    @include mq.notebook {
      text-align: left;
    }
  }

  &__icons {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--size-16);
    margin: var(--size-32) 0;
  }

  &__pills {
    display: flex;
    justify-content: center;
    margin-top: var(--size-12);
  }
}

// Override the OrganismsListingSidebarIcons styles when inside mobile overview
.o-listing-overview__icons .o-listing-sidebar-icons {
  justify-content: center;
  text-align: center;

  .o-listing-sidebar-icons__row {
    justify-content: center;
    text-align: center;
  }
}

// Override the OrganismsListingSidebarPills styles when inside mobile overview
.o-listing-overview__pills .sidebar-pills {
  justify-content: center;
  text-align: center;
}
</style>