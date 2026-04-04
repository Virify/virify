<template>
  <section class="o-dock-banner | flow flow-lg">
    <div ref="form" class="o-dock-banner__form-height" role="presentation">
      <MoleculesAiSearchFormLocation class="o-dock-banner__form" @location-selected="showModalFromElement" />
    </div>

    <AtomsButton v-if="hasLocation" class="o-dock-banner__toggle | button-full button-xs" type="button"
      @click.prevent="showModalFromElement">
      Expand form
    </AtomsButton>
  </section>
</template>

<script setup lang="ts">
/**
 *  Show modal
 */
const $form = useTemplateRef('form')
const { showModal } = useGlobalSearch()

function showModalFromElement() {
  showModal($form.value)
}

/**
 *  Fetch filters
 */
<<<<<<< HEAD
const { searchState } = useSearchState()
=======
const { setQuery, setListingType, searchState, setSearchPending } = useSearchState()
const { checkText, isChecking } = useModeration()
const toast = useToast()

const initialQuery = computed(() => {
  const { query } = asObject(searchState.value)

  return query
})

async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  const { location } = asObject(searchState.value)

  if (!location) {
    return
  }

  try {
    await animateFormToDock()
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
    await navigateTo('/search')

  } catch (error) {
    console.error('Traditional search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error' })
    setSearchPending(false)
  }
}

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
    await animateFormToDock()
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
    await navigateTo('/search')

    window.scrollTo({
      top: 0,
      behavior: "instant"
    })
  } catch (error) {
    console.error('AI search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error' })
    setSearchPending(false)
  }
};

function searchReset() {
  setQuery('')
}
>>>>>>> main

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

.o-dock-banner {
  position: relative;

  &__form-height {
    height: 6em;
    overflow: visible;

    @include mq.tablet {
      height: 5em;
    }
  }

  &__form {
    position: relative;
    z-index: 2;
  }

  &__toggle {
    position: absolute;
    top: calc(100% + var(--size-16));
    left: 0;
    margin: 0;
    color: var(--foreground-100);
    background-color: var(--background-100);
    transition: background-color var(--animation-fast) var(--ease-in-out);

    &:hover {
      background-color: var(--background-300);
    }

    &--expanded {
      margin-top: var(--size-36);
    }
  }

  &__toggle-content {
    padding: 0 var(--size-6) var(--size-6);

    @include mq.small-tablet {
      padding: 0 var(--size-16) var(--size-16);
    }
  }

  &__toggle-content-loader {
    --tab-height-offset: 3.6rem;
    min-height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: var(--size-24);

    .a-icon {
      width: var(--size-40);
      height: var(--size-40);
    }

    &--dark {
      border-radius: var(--border-radius-2xl);
      margin: var(--tab-height-offset) var(--size-6) var(--size-6);

      @include mq.small-tablet {
        margin: var(--tab-height-offset) var(--size-16) var(--size-16);
      }

      /**
       *  @TODO This is currently duplicated from the component:
       *        OrganismsTraditionalSearchContract - we should probably
       *        create a global utility class so this can be 'shared'
       */
      background: linear-gradient(to bottom, var(--blue-400), var(--blue-300));
      color: var(--monochrome-900);
    }
  }
}
</style>