<template>
  <div class="p-dock" :class="{
    'p-dock--has-grid': showGrid,
  }">
    <OrganismsPaneSlider v-if="!hash || isMounted" @boundary-exceeded="updateViewMode" :left-slot="showGrid"
      :right-slot="showMap" :class="{
        '| container': showGrid,
      }">
      <template #left v-if="showGrid">
        <OrganismsResults v-if="pending || resultsValidated.length" :results="resultsValidated" :is-loading="pending" />

        <MoleculesAiSearchNoResults v-else :last-search-query="query || 'No previous search'" />
      </template>

      <!-- Use v-show to keep map in DOM once initialized, avoiding expensive re-initialization -->
      <template #right>
        <LazyOrganismsAiSearchMapView hydrate-when-visible v-show="showMap" class="p-dock__map"
          :results="resultsValidated" :is-searching="pending" :has-searched="!!currentHash" :radius :location />
      </template>
    </OrganismsPaneSlider>

    <MoleculesAiSearchLoading v-if="hash && (!isMounted || pending)" class="p-dock__loading" />

    <OrganismsDock />
  </div>
</template>

<script setup lang="ts">
import { useMounted } from '@vueuse/core';

const { params: { hash } } = useRoute();
const isMounted = useMounted()

/**
 * Search Results Page
 */
const { location, radius, query, locationName, } = useGlobalSearchState();
const { results, hash: currentHash } = useSearchResults()
const { pending, fetchResults, fetchHash } = useFetchResults()

/**
 * Re-run search on page load if we have search metadata but no results
 * This handles page refreshes and back/forward navigation
 */
onMounted(async () => {
  // Check if a search hash exists; is a string; and is different from
  // the existing search results state
  if (isString(hash) && hash !== currentHash.value) {
    const { setResults, setResultsHash } = useSearchResults();

    // Set existing results, if they exist
    setResults(results);
    setResultsHash(hash);

    // Fetch hash
    return fetchHash(hash);
  }

  // If hash exists, assume the hash has not changed and do nothing
  if (isString(hash)) return

  // Fetch results
  fetchResults();
});

/**
 *  Update layout
 */
const { currentView, setCurrentView } = useResultsViewMode();

function updateViewMode(newView: string) {
  setCurrentView(newView === "left" ? "map" : "grid");
}

const showGrid = computed(() => {
  return currentView.value === "grid" || currentView.value === "split";
});

const showMap = computed(() => {
  return currentView.value === "map" || currentView.value === "split";
});

/**
 *  Scroll to top for map view
 */
watch(currentView, (layout) => {
  if (layout !== "map") return;

  window.scrollTo({ top: 0, behavior: "instant" });
});

/**
 *  Ensure missing results do not break the map
 */
const resultsValidated = computed((): ListingCardData[] => {
  if (!Array.isArray(results.value)) return [];

  // Filter out any results with null properties and properly type as ListingCardData
  return results.value.filter((r): r is ListingCardData => r.property !== null);
});

/**
 * SEO Meta
 */
const seoTitle = computed(() => {
  return `${query.value || 'properties'} in ${locationName.value || 'the UK'} | Virify Property Search`;
});

const seoDescription = computed(() => {
  return `Find ${query.value || 'properties'} in ${locationName.value || 'the UK'}. Search properties for sale and rent with Virify's AI-powered property search. Compare prices, view photos, and find your perfect home.`;
});

useHead({
  title: seoTitle,
});

useSeoMeta({
  description: seoDescription,
  ogType: "website",
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogSiteName: "Virify",
  ogImage: "/img/og-search.jpg",
  ogLocale: "en_GB",
  twitterCard: "summary_large_image",
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: "/img/og-search.jpg",
  robots: "noindex, nofollow",
});

/**
 * Structured data for search results (SEO)
 */
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: computed(() =>
        JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: seoTitle.value,
          description: seoDescription.value,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: resultsValidated.value.length,
            itemListElement: resultsValidated.value
              .slice(0, 10)
              .map((result: any, index: number) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "RealEstateListing",
                  name: result.property?.address?.street || "Property",
                  url: `https://virify.co.uk/listing/${result.id}`,
                },
              })),
          },
        }),
      ),
    },
  ],
});
</script>

<style lang="scss">
.p-dock {
  min-height: calc(100vh - var(--header-height));

  &--has-grid {
    padding: var(--size-16) 0;
  }

  &--has-grid &__map {
    position: sticky;
    top: calc(var(--header-height) + var(--size-20));
    height: calc(100vh - var(--header-height) - var(--size-32));
    border-radius: var(--border-radius-2xl);
  }

  &__map {
    width: 100%;
    overflow: hidden;
    height: calc(100vh - var(--header-height));
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    z-index: 8;
    background: radial-gradient(var(--background-200), transparent);
    gap: var(--size-16);

    .m-ai-search-loading__content {
      max-width: 24ch;
      line-height: var(--lineheight-sm);
      font-size: var(--font-lg);
    }
  }
}
</style>
