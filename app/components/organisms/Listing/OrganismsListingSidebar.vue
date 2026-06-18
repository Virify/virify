<template>
  <section
    role="presentation"
    class="o-listing-sidebar | flow flow-md"
  >
    <h2
      v-if="price"
      class="o-listing-sidebar__title | title-2xl lineheight-xs"
    >
      <div class="o-listing-sidebar__title-offertype">
        <AtomsPill class="o-listing-sidebar__title-offertype__item | body-xs">
          {{ convertEnumToString(priceType!) }}
        </AtomsPill>
        <AtomsPill class="o-listing-sidebar__title-offertype__item | body-xs">
          {{ convertEnumToString(available!) }}
        </AtomsPill>
      </div>

      <AtomsListingStatusBadges
        class="o-listing-sidebar__status-badges"
        :price-history="priceHistory"
        :current-price-number="currentPriceNumber"
        :open-house-badge-label="openHouseBadgeLabel"
      />

      {{ price }}
    </h2>

    <p
      role="presentation"
      class="o-listing-sidebar__address | body-md font-bold"
    >
      {{ address }}
    </p>

    <OrganismsListingSidebarIcons
      :property-type="propertyType"
      :bedrooms="bedrooms"
      :bathrooms="bathrooms"
      :receptions="receptions"
      :other-rooms="otherRooms"
      :has-garden="hasGarden"
      :has-land="hasLand"
      :classification="classification"
    />

    <OrganismsListingSidebarPills
      :property-size="propertySize"
      :chain-free="chainFree"
      :year-built="newBuild"
      :construction-type="constructionType"
    />

    <OrganismsListingButtons
      :listing-id="listingId"
      :agent="agent"
      :is-draft="isDraft"
      :listing-type="listingType"
    />

    <OrganismsListingAgent :agent="agent" />
  </section>
</template>

<script setup lang="ts">
  interface Props {
    price?: string;
    listingId: number;
    listingType: "sale" | "rent";
    address?: string;
    propertyType?: string;
    propertySize?: number;
    priceType?: string;
    bedrooms?: number;
    bathrooms?: number;
    receptions?: number;
    otherRooms?: number;
    classification?: string;
    yearBuilt?: string;
    constructionType?: string;
    chainFree?: boolean | null;
    agent?: {
      username?: string | null;
      email?: string | null;
      id?: number | null;
      createdAt?: Date | String | null;
      avatar?: string | null;
    };
    hasGarden?: boolean;
    hasLand?: boolean;
    available?: string;
    isDraft?: boolean;
    priceHistory?: PriceHistoryEntry[];
    currentPriceNumber?: number;
    openHouseBadgeLabel?: string | null;
  }

  const props = defineProps<Props>();

  const { loggedIn } = useUserSession();
  const { viewings, getActiveViewingForListing, getViewingStatusLabel, fetchViewings } =
    useViewings();

  onMounted(() => {
    if (loggedIn.value && viewings.value.length === 0) {
      fetchViewings().catch(() => {});
    }
  });

  const viewingLabel = computed(() => {
    const v = getActiveViewingForListing(props.listingId);
    return v ? getViewingStatusLabel(v) : null;
  });

  const newBuild = computed(() => {
    // if built in the last 3 years, return "New build"
    if (props.yearBuilt && new Date().getFullYear() - parseInt(props.yearBuilt) <= 3) {
      return "New build";
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

    &__status-badges {
      margin-top: var(--size-8);
      margin-bottom: var(--size-8);
    }

    &__address {
      margin: 0;
      color: var(--primary-400);
    }

    &__agent-link {
      text-decoration: none;
      display: block;
    }
  }
</style>
