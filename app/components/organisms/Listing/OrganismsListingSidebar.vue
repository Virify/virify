<template>
  <section role="presentation" class="o-listing-sidebar | flow flow-md">
    <h2 v-if="price" class="o-listing-sidebar__title | title-2xl lineheight-xs">
      <div class="o-listing-sidebar__title-offertype">
        <AtomsPill class="o-listing-sidebar__title-offertype__item | body-xs">
          {{ convertRoomEnumToString(priceType!) }}
        </AtomsPill>
        <AtomsPill class="o-listing-sidebar__title-offertype__item | body-xs">
          {{ convertRoomEnumToString(available!) }}
        </AtomsPill>
      </div>


      {{ price }}
    </h2>

    <p role="presentation" class="o-listing-sidebar__address | body-md font-bold">
      {{ address }}
    </p>

    <OrganismsListingSidebarIcons :property-type="propertyType" :bedrooms="bedrooms" :bathrooms="bathrooms"
      :receptions="receptions" :other-rooms="otherRooms" :has-garden="hasGarden" :has-land="hasLand"
      :classification="classification" />

    <OrganismsListingSidebarPills :property-size="propertySize" :chain-free="chainFree" :year-built="newBuild"
      :construction-type="constructionType" />

    <OrganismsListingButtons :listing-id="listingId" :agent="agent" />

    <NuxtLink v-if="agent" to="#" class="o-listing-sidebar__agent-link">
      <OrganismsListingAgent :agent="agent" />
    </NuxtLink>

    <OrganismsListingAgent v-else :agent="agent" />
  </section>
</template>

<script setup lang="ts">
interface Props {
  price?: string
  listingId: number
  address?: string
  propertyType?: string
  propertySize?: number
  priceType?: string
  bedrooms?: number
  bathrooms?: number
  receptions?: number
  otherRooms?: number
  classification?: string
  yearBuilt?: string
  constructionType?: string
  chainFree?: boolean | null
  agent?: {
    username?: string | null
    email?: string | null
    id?: number | null
    createdAt?: Date | String | null
    avatar?: string | null
  }
  hasGarden?: boolean
  hasLand?: boolean
  available?: string
}

const props = defineProps<Props>()

const newBuild = computed(() => {
  // if built in the last 3 years, return "New build"
  if (props.yearBuilt && new Date().getFullYear() - parseInt(props.yearBuilt) <= 3) {
    return 'New build';
  }
});

</script>

<style lang="scss">
.o-listing-sidebar {
  max-width: 20em;

  &__title {
    margin-bottom: 0;
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

  &__address {
    margin: 0;
    color: var(--secondary-400);
  }

  &__agent-link {
    text-decoration: none;
    display: block;
  }
}
</style>