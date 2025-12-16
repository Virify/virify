<template>
  <div class="m-autocomplete-popover | flow elevate-200">
    <template v-if="searchValue && !suppressAutocomplete && !hideAutocomplete">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Suggestions</h3>

      <MoleculesAutocompleteList v-if="locationSuggestions?.length" :options="locationSuggestions"
        v-slot="{ option, rowClass, actionClass }">
        <button type="button" :class="rowClass" @click.prevent="setLocation(option)">
          {{ getShortLocationName(option) }}
        </button>

        <MoleculesAutocompleteSaveLocation :option :custom-class="actionClass" />
      </MoleculesAutocompleteList>

      <MoleculesAutocompleteList v-else-if="isPending" :options="Array.from({ length: 5 })">
        <span class="m-autocomplete-popover__empty-suggestion | skeleton"></span>
        <span class="m-autocomplete-popover__empty-suggestion-pin | skeleton"></span>
      </MoleculesAutocompleteList>

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        {{ autocompleteFeedback }}
      </p>
    </template>

    <template v-if="loggedIn">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Saved locations</h3>

      <ul class="m-autocomplete-popover__pill-list" v-if="entries?.length">
        <li v-for="entry of entries" :key="entry.name">
          <AtomsButtonPill :content="entry.name" variant="ghost" icon="search/pin"
            @click.prevent="setLocationFromSaved(entry as UserSavedLocation)" />
        </li>

        <li>
          <AtomsButtonPill content="Edit" variant="solid" icon="ai/edit" @click.prevent="updateSavedLocations" />
        </li>
      </ul>

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        You do not currently have any saved locations
      </p>
    </template>

    <ClientOnly>
      <template v-if="showHistory">
        <h3 class="m-autocomplete-popover__title | title-3xs faded-text">History</h3>

        <MoleculesAutocompleteList :options="locationHistory" v-slot="{ option, rowClass, actionClass }">
          <button type="button" :class="rowClass" @click.prevent="setLocation(option)">
            {{ getShortLocationName(option) }}
          </button>

          <button type="button" aria-label="Remove saved location" :class="actionClass" class="| faded-icon"
            @click.prevent="removeLocationFromHistory(option)">
            <AtomsIcon icon="search/remove" />
          </button>
        </MoleculesAutocompleteList>
      </template>
    </ClientOnly>

    <template v-if="trendingLocations?.length">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Trending locations</h3>

      <ul class="m-autocomplete-popover__pill-list">
        <li v-for="entry of trendingLocations" :key="entry.name">
          <AtomsButtonPill :content="entry.name" variant="ghost" icon="search/trending" :icon-end="false"
            @click.prevent="setLocationFromTrending(entry as TrendingLocation)" />
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ViewsDialogSavedLocations } from '#components';
import type { UserLocation } from '~~/layers/database/server/database/prisma/generated/client';

const { trendingLocations } = useAnalytics();
const locationSuggestions = ref<GeocodingFeature[]>([]);
const suppressAutocomplete = ref(false);

interface Props {
  searchValue?: string
}

const props = defineProps<Props>()

/**
 *  Saved locations
 */
const { loggedIn } = useUserSession();
const { entries, getEntries, clearEntries } = useSavedLocation();

/**
 * Hide autocomplete if current search value exactly matches one of the suggestions
 */
const hideAutocomplete = computed(() => {
  if (!locationSuggestions.value.length || !props.searchValue) return false;

  return locationSuggestions.value.some(option =>
    option.display_name === props.searchValue
  );
});

/**
 * Show history when there are no suggestions OR when we're hiding autocomplete
 */
const showHistory = computed(() => {
  return !locationSuggestions.value.length || hideAutocomplete.value;
})

watch(loggedIn, (isAuthenticated) => {
  if (isAuthenticated) {
    getEntries()

    return
  }

  clearEntries()
}, { immediate: true })

/**
 *  Edit saved locations
 */
const { showDialog } = useDialog()

function updateSavedLocations() {
  showDialog({
    component: ViewsDialogSavedLocations
  })
}

/**
 *  History state
 */
const {
  entries: locationHistory,
  addEntry: addLocationToHistory,
  removeEntry: removeLocationFromHistory
} = useLocationHistory()

/**
 *  Set locations
 */
const emits = defineEmits(['location-selected'])

function setLocationFromTrending(option: Partial<TrendingLocation>) {
  const { location } = asObject(option)
  if (location) {
    addLocationToHistory(location as GeocodingFeature)
    emits('location-selected', location)
    suppressAutocomplete.value = true
  }
}

function setLocationFromSaved(option: Partial<UserLocation>) {
  const { geocodingFeature } = asObject(option)

  if (geocodingFeature) {
    addLocationToHistory(geocodingFeature as GeocodingFeature)
    emits('location-selected', geocodingFeature)
    suppressAutocomplete.value = true
  }
}

function setLocation(option: MaybeRef<GeocodingFeature>) {
  const rawOption = unref(option)

  addLocationToHistory(rawOption)
  emits('location-selected', rawOption)
  suppressAutocomplete.value = true
}

/**
 * Get a short but unique location name
 * e.g. "Cardiff, Wales" instead of "Cardiff" or "Cardiff, Wales, United Kingdom"
 * For postcodes, include more address detail: "CF10 3NQ, Castle Street, Cardiff"
 */
function getShortLocationName(location: GeocodingFeature): string {
  const fullName = location.place_name_en || location.place_name || ''
  const parts = fullName.split(', ')
  const text = location.text || ''
  
  // Check if this is a postcode (UK postcode pattern)
  const isPostcode = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(text)
  
  // Remove country/region names from the end
  const filteredParts = parts.filter(part => 
    !['United Kingdom', 'UK', 'England', 'Scotland', 'Wales', 'Northern Ireland'].includes(part)
  )
  
  if (isPostcode && filteredParts.length >= 2) {
    // For postcodes: show more detail "CF10 3NQ, Castle Street, Cardiff"
    return filteredParts.slice(0, 3).join(', ')
  }
  
  // For other locations: take first 2 parts for context
  // e.g. "Cardiff, City of Cardiff" or "Cardiff Road, Newport"
  return filteredParts.slice(0, 2).join(', ') || text || fullName
}

/**
 * Autocompletion
 */
const { isPending, setPendingWhile } = usePending()
const { autoComplete } = useMap();

watch(
  () => props.searchValue,
  async (newVal, oldVal) => {
    setPendingWhile(async () => {
      // Reset suppressAutocomplete if user is typing new content
      if (suppressAutocomplete.value && newVal && oldVal && newVal !== oldVal) {
        suppressAutocomplete.value = false;
      }

      // Only reset suppressAutocomplete if the input is cleared
      if (suppressAutocomplete.value && (!newVal || newVal.trim() === '')) {
        suppressAutocomplete.value = false;
        return;
      }

      if (newVal && newVal.trim().length > 2) {
        locationSuggestions.value = await autoComplete(newVal)
      } else {
        locationSuggestions.value = []
      }
    })
  },
  { immediate: true }
)

const autocompleteFeedback = computed(() => {
  const { searchValue } = props
  const MIN_SEARCH_LENGTH = 4

  if (searchValue && searchValue.length < MIN_SEARCH_LENGTH) {
    return 'Keep typing for location suggestions...'
  }

  return `No matches for "${searchValue}"`
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.m-autocomplete-popover {
  background-color: var(--background-200);
  border-radius: var(--border-radius-xl);
  padding: var(--size-16);
  border: 1px solid var(--border-color-100);

  @include mq.tablet {
    padding: var(--size-32);
    border-radius: var(--border-radius-2xl);
  }

  &__title {
    margin-bottom: var(--size-16);

    &:not(:first-of-type) {
      margin-top: var(--size-32);
    }
  }

  &__pill-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: var(--size-8);
  }

  &__empty {
    padding: var(--size-16);
    background: var(--background-100);
    border-radius: var(--border-radius-xl);
    text-align: center;
  }

  &__empty-suggestion {
    width: min(70%, 40ch);
  }
}
</style>