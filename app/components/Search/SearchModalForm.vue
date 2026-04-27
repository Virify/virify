<template>
  <div role="presentation" class="search-form-modal">
    <MoleculesAiSearchFormLocation class="search-form-modal__location" />

    <OrganismsFilterSwitcher v-if="hasLocation" class="search-form-modal__switcher js-search-modal-initial-focus">
      <template v-slot:traditional>
        <OrganismsTraditionalSearchFormSkeleton v-if="isTraditionalFormLoading" />

        <LazyOrganismsTraditionalSearchForm @is-loaded="hideTraditionalFormLoader"
          @submit-search="traditionalSearchSubmit" class="search-form-modal__toggle-content" />
      </template>

      <template v-slot:ai>
        <MoleculesAiSearchFormFilters :initial-query :disabled="!hasLocation" hideReset @submit-search="aiSearchSubmit"
          @reset-search="searchReset" />
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
 *  Manage lazy hydration
 */
const isTraditionalFormLoading = ref(true)

function hideTraditionalFormLoader() {
  isTraditionalFormLoading.value = false
}

/**
 *  Fetch filters
 */
const { location, setQuery, setFormData } = useGlobalSearchState()
const { setPending } = useFetchResults()
const toast = useToast()

/**
 *  Traditional search form handler
 */
async function traditionalSearchSubmit(formData: TraditionalSearchData) {
  if (!location.value) {
    return
  }

  try {
    setPending(true)

    // Set search parameters and navigate instead of fetching here
    // The search page will handle the fetch
    setFormData(formData, 'traditional')

    // Navigate to search results page
    emit('animate-to-dock')

  } catch (error) {
    console.error('Traditional search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error', icon: 'i-lucide-search-x' })
    setPending(false)
  }
}

/**
 *  AI search form handler
 */
async function aiSearchSubmit(query: string) {
  if (!location.value) {
    return
  }

  try {
    setPending(true)
    setFormData(query, 'ai')

    // Navigate to search results page
    emit('animate-to-dock')
  } catch (error) {
    console.error('AI search error:', error)
    toast.add({ title: 'Error', description: 'Search failed. Please try again.', color: 'error', icon: 'i-lucide-search-x' })
    setPending(false)
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
  return import.meta.client && !!location.value
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.search-form-modal {
  display: flex;
  flex-direction: column;
  gap: var(--size-16);

  &__switcher {
    interpolate-size: allow-keywords;

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