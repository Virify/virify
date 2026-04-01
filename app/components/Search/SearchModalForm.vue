<template>
  <div role="presentation" class="| flow flow-lg">
    <MoleculesAiSearchFormLocation />

    <OrganismsFilterSwitcher v-if="hasLocation" class="search-form-modal__switcher">
      <template v-slot:traditional>
        <p>Traditional</p>
      </template>

      <template v-slot:ai>
        <MoleculesAiSearchFormFilters :initial-query :disabled="!hasLocation" hideReset @submit-search="aiSearchSubmit"
          @reset-search="searchReset" :loading="isChecking" class="search-modal-form__toggle-content" />
      </template>
    </OrganismsFilterSwitcher>
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
 *  Fetch filters
 */
const { setQuery, setListingType, searchState, setSearchPending } = useSearchState()
const { checkContent, isChecking } = useModeration()
const toast = useToast()

const initialQuery = computed(() => {
  const { query } = asObject(searchState.value)

  return query
})

async function aiSearchSubmit(query: string) {
  setListingType(props.listingType)

  const { location, radius, listingType } = asObject(searchState.value)

  if (!location) {
    return
  }

  // Check content moderation before proceeding
  const { safe, reason } = await checkContent(query)
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
.search-form-modal {

  &__switcher {
    interpolate-size: allow-keywords;

    height: calc-size(max-content, size);
    transition: height, margin;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-out);
    overflow: hidden;

    @starting-style {
      height: 0;
      margin: 0;
    }
  }
}
</style>