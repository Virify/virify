<template>
  <div class="p-ai-search-results | container flow" v-if="results">
    <h2 class="results-title | title-md">
      Found {{ props.totalResults }} results
    </h2>

    <!-- Sorted results with proper interleaving -->
    <div class="p-ai-search-results__sorted-content">
      <template
        v-for="section in sortedResults"
        :key="section.type + (section.item?.id || section.items?.[0]?.id)"
      >
        <!-- Premium card row -->
        <div
          v-if="section.type === 'premium'"
          class="p-ai-search-results__premium-row"
        >
          <OrganismsListingCardPremium
            :listing="(section.item as ListingCardData)"
          />
        </div>

        <!-- Grid row with basic/featured cards -->
        <div
          v-else-if="section.type === 'grid-row'"
          class="p-ai-search-results__grid-row"
        >
          <template v-for="listing in section.items!" :key="listing.id">
            <OrganismsListingCardFeatured
              v-if="listing.listingTier === 'FEATURED'"
              :listing="(listing as ListingCardData)"
            />
            <OrganismsListingCardBase
              v-else
              :listing="(listing as ListingCardData)"
            />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { distributePremiumListings } from "~/utils/results/listing-distribution";

const props = withDefaults(
  defineProps<{
    results: ListingWithFullProperty[];
    queryAnalysis: QueryAnalysis | null;
    totalResults?: number;
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
  }
);

defineEmits<{
  "page-change": [page: number];
}>();

const sortedResults = computed(() => distributePremiumListings(props.results));
</script>

<style lang="scss">
.p-ai-search-results {
  &__sorted-content {
    display: flex;
    flex-direction: column;
    gap: var(--size-32);
    margin-bottom: var(--size-40);
  }

  &__premium-row {
    width: 100%;
  }

  &__grid-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-32);
    margin: 0;
    padding: 0;
    align-items: stretch;
  }

  &__grid-row > * {
    flex: 1 1 45%;
    min-width: 300px;
    max-width: 50%;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    &__grid-row > * {
      min-width: 100%;
      max-width: 100%;
      flex-basis: 100%;
    }
  }
}

.results-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--size-16);
  margin-top: var(--size-32);
  margin-bottom: var(--size-48);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--foreground-200);
  font-weight: var(--font-medium);
}
</style>
