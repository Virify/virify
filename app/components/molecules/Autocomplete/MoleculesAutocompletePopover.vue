<template>
  <div ref="root" class="m-autocomplete-popover | flow elevate-200">
    <template v-if="searchValue && !suppressAutocomplete && !hideAutocomplete">
      <h3 class="m-autocomplete-popover__title | title-3xs faded-text">Suggestions</h3>

      <MoleculesAutocompleteList v-if="locationSuggestions?.length" :options="locationSuggestions"
        v-slot="{ option, rowClass, actionClass, index }">
        <button type="button" :class="[rowClass, {
          selected: index === highlightedIndex
        }]" @click.prevent="setLocation(option)">
          {{ option.place_name_en || option.place_name }}
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
          <button type="button" :class="rowClass" @click.prevent="selectFromHistory(option)">
            {{ option.place_name_en || option.place_name }}
          </button>

          <MoleculesAutocompleteSaveLocation :option="(option as GeocodingFeature)" :custom-class="actionClass" />

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
 * Show history when there are entries AND (no suggestions OR we're hiding autocomplete)
 */
const showHistory = computed(() => {
  return locationHistory.value.length > 0 && (!locationSuggestions.value.length || hideAutocomplete.value);
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
const { enhanceWithBoundaryPolygon } = useMap()

async function setLocationFromTrending(option: TrendingLocation) {
  const feature: GeocodingFeature = {
    id: option.locationId,
    type: 'Feature',
    place_name: option.placeName || option.name,
    place_name_en: option.placeName || option.name,
    text: option.name,
    geometry: { type: 'Point', coordinates: [option.lon, option.lat] },
    properties: {},
  }

  const enhancedLocation = await enhanceWithBoundaryPolygon(feature)
    .catch(() => feature)

  addLocationToHistory(enhancedLocation)
  emits('location-selected', enhancedLocation)
  suppressAutocomplete.value = true
}

async function setLocationFromSaved(option: UserSavedLocation) {
  const { geocodingFeature } = asObject(option)

  if (geocodingFeature) {
    // Enhance location with boundary polygon before adding to history
    const enhancedLocation = await enhanceWithBoundaryPolygon(geocodingFeature as GeocodingFeature)
      .catch(() => geocodingFeature as GeocodingFeature)

    addLocationToHistory(enhancedLocation)
    emits('location-selected', enhancedLocation)
    suppressAutocomplete.value = true
  }
}

async function setLocation(option: MaybeRef<GeocodingFeature>) {
  const rawOption = unref(option)

  // Reset any autocomplete suggestions
  resetHighlightedIndex()

  // Enhance location with boundary polygon before adding to history
  const enhancedLocation = await enhanceWithBoundaryPolygon(rawOption)
    .catch(() => rawOption)

  addLocationToHistory(enhancedLocation)
  emits('location-selected', enhancedLocation)
  suppressAutocomplete.value = true
}

function selectFromHistory(option: GeocodingFeature) {
  // History items are already enhanced — emit directly without re-enhancing
  addLocationToHistory(option)
  emits('location-selected', option)
  suppressAutocomplete.value = true
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

/**
 *  a11y selection
 */
const highlightedIndex = shallowRef(-1)
const $root = useTemplateRef('root')

// Reset highlighted index
function resetHighlightedIndex() {
  highlightedIndex.value = -1
}

// Auto-complete navigation
function navigateAutocompleteSuggestions(e: KeyboardEvent) {
  if (!hideAutocomplete || !locationSuggestions.value?.length) return

  // Handle selections
  if (highlightedIndex.value !== -1 && e.key === 'Enter') {
    e.preventDefault()

    // Get current button
    const selected = $root.value?.querySelector('button.selected')

    // If button exists, click it
    if (isElement(selected)) {
      selected.click()
    }

    return
  }

  // Ignore if no suggestions, or keys are not up/down on arrow pad
  if (!['ArrowUp', 'ArrowDown'].includes(e.key)) {
    return
  }

  // Prevent scrolling
  e.preventDefault()

  // Move down
  if (e.key === 'ArrowDown') {
    highlightedIndex.value++

    if (highlightedIndex.value >= locationSuggestions.value.length) {
      highlightedIndex.value = 0
    }

    return
  }

  // Move up
  highlightedIndex.value--

  if (highlightedIndex.value < 0) {
    highlightedIndex.value = locationSuggestions.value.length - 1
  }
}

// Reset count on value change
watch(() => props.searchValue, resetHighlightedIndex)

onMounted(() => {
  window.addEventListener('keydown', navigateAutocompleteSuggestions)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', navigateAutocompleteSuggestions)
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.m-autocomplete-popover {
  background-color: var(--background-100);
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
    background: var(--background-200);
    border-radius: var(--border-radius-xl);
    text-align: center;
  }

  &__empty-suggestion {
    width: min(70%, 40ch);
  }
}
</style>