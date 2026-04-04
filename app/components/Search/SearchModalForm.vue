<template>
  <div role="presentation" class="search-form-modal">
    <OrganismsFilterSwitcher v-if="hasLocation" class="search-form-modal__switcher">
      <template v-slot:traditional>
        <OrganismsTraditionalSearchFormSkeleton v-if="isTraditionalFormLoading" />

        <LazyOrganismsTraditionalSearchForm @is-loaded="hideTraditionalFormLoader"
          @submit-search="traditionalSearchSubmit" class="search-form-modal__toggle-content" />
      </template>

      <template v-slot:ai>
        <MoleculesAiSearchFormFilters :initial-query :disabled="!hasLocation" hideReset @submit-search="aiSearchSubmit"
          @reset-search="searchReset" :loading="isChecking" />
      </template>
    </OrganismsFilterSwitcher>

    <MoleculesAiSearchFormLocation class="search-form-modal__location" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingType?: ListingType;
}

const props = withDefaults(defineProps<Props>(), {
  listingType: 'all'
});

/**
 *  Navigate to new page on search
 */
const emit = defineEmits(['animate-to-dock'])

/**
 *  Manage lazy hydration
 */
const isTraditionalFormLoading = ref(true)

function hideTraditionalFormLoader() {
  isTraditionalFormLoading.value = false
}

/**
 *  Fetch filters
 */
const { setQuery, setListingType, searchState, setSearchPending } = useSearchState()
const { checkText, isChecking } = useModeration()
const toast = useToast()

const initialQuery = computed(() => {
  const { query } = asObject(searchState.value)

  return query
})

/**
 *  Traditional search form handler
 */
async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  const { location } = asObject(searchState.value)

  if (!location) {
    return
  }

  try {
    setSearchPending(true)

    // Build query analysis from form data for filter badges
    const queryAnalysis = buildQueryAnalysisFromFormData(formData)

    // Set search parameters and navigate instead of fetching here
    // The search page will handle the fetch
    searchState.value = {
      ...asObject(searchState.value),
      searchType: 'traditional',
      traditionalSearchForm: formData,
      queryAnalysis,
      results: [], // Clear old results
      hasSearched: false
    }

    // Navigate to search results page
    emit('animate-to-dock')

  } catch (error) {
    console.error('Traditional search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error' })
    setSearchPending(false)
  }
}

/**
 *  AI search form handler
 */
async function aiSearchSubmit(query: string) {
  setListingType(props.listingType)

  const { location, radius, listingType } = asObject(searchState.value)

  if (!location) {
    return
  }

  // Check content moderation before proceeding
  const { safe, reason } = await checkText(query)
  if (!safe) {
    toast.add({ title: 'Error', description: reason || 'Please try a different search.', color: 'error' })
    return
  }

  try {
    setSearchPending(true)

    // Set search parameters and navigate instead of fetching here
    // The search page will handle the fetch
    searchState.value = {
      ...asObject(searchState.value),
      searchType: 'ai',
      query,
      listingType: listingType === 'sale' ? 'sale' : listingType === 'rent' ? 'rent' : 'all',
      radius: radius ?? 5,
      results: [], // Clear old results
      hasSearched: false
    }

    // Navigate to search results page
    emit('animate-to-dock')
  } catch (error) {
    console.error('AI search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error' })
    setSearchPending(false)
  }
};

function searchReset() {
  setQuery('')
}

/**
 *  Disable filters button if no location is added - to avoid hydration
 *  mismatch, server never has a location
 *
 */
const hasLocation = computed(() => {
  const { location } = asObject(searchState.value)

  return import.meta.client && !!location
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.search-form-modal {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  &__location {
    order: 1;
  }

  &__switcher {
    interpolate-size: allow-keywords;

    order: 2;
    height: calc-size(max-content, size);
    transition: height, margin;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);
    transition-delay: var(--animation-medium);
    overflow: clip;
    overflow-x: visible;

    @starting-style {
      height: 0;
      margin: 0;
    }
  }

  &__toggle-content {
    padding: 0 var(--size-6) var(--size-6);

    @include mq.small-tablet {
      padding: 0 var(--size-16) var(--size-16);
    }
  }
}
</style>