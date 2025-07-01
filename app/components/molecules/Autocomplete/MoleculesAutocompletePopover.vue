<template>
  <div class="m-autocomplete-popover | flow elevate-200">
    <MoleculesAutocompleteSection v-if="searchValue && !suppressAutocomplete" title="Suggestions">
      <MoleculesAutocompleteList v-if="locationSuggestions?.length" :options="locationSuggestions"
        v-slot="{ option, rowClass, actionClass }">
        <button type="button" :class="rowClass" @click.prevent="setLocation(option)">
          {{ option.place_name_en }}
        </button>

        <MoleculesAutocompleteSaveLocation :option :custom-class="actionClass" />
      </MoleculesAutocompleteList>

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        No matches for "{{ searchValue }}"
      </p>

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>

    <MoleculesAutocompleteSection v-if="loggedIn" title="Saved locations">
      <MoleculesAutocompletePills v-if="entries?.length" :options="entries" v-slot="{ option }">
        <AtomsButtonPill :content="option.name" variant="ghost" icon="search/pin"
          @click.prevent="setLocationFromSaved(option)" />
      </MoleculesAutocompletePills>

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        You do not currently have any saved locations
      </p>

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>

    <ClientOnly>
      <MoleculesAutocompleteSection v-if="locationHistory.length" title="History">
        <MoleculesAutocompleteList :options="locationHistory" v-slot="{ option, rowClass, actionClass }">
          <button type="button" :class="rowClass" @click.prevent="setLocation(option)">
            {{ option.place_name_en }}
          </button>

          <button type="button" aria-label="Remove saved location" :class="actionClass" class="| faded-icon"
            @click.prevent="removeLocationFromHistory(option)">
            <AtomsIcon icon="search/remove" />
          </button>
        </MoleculesAutocompleteList>

        <div role="separator" class="m-autocomplete-popover__spacer" />
      </MoleculesAutocompleteSection>
    </ClientOnly>

    <MoleculesAutocompleteSection v-if="mockTrending?.length" title="Trending locations">
      <MoleculesAutocompletePills :options="mockTrending" v-slot="{ option }">
        <AtomsButtonPill :content="option.name" variant="ghost" icon="search/trending" :icon-end="false"
          @click.prevent="setLocationFromTrending(option)" />
      </MoleculesAutocompletePills>
    </MoleculesAutocompleteSection>
  </div>
</template>

<script setup lang="ts">
const locationSuggestions = ref<GeocodingFeature[]>([]);
const suppressAutocomplete = ref(false);

interface Props {
  searchValue: string
}

const props = defineProps<Props>()

/**
 *  Saved locations
 */
const { loggedIn } = useUserSession();
const { entries, getEntries, clearEntries } = useSavedLocation();

watch(loggedIn, (isAuthenticated) => {
  if (isAuthenticated) {
    getEntries()

    return
  }

  clearEntries()
}, { immediate: true })


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
function setLocationFromSaved(option: Partial<UserSavedLocation>) {
  const { geocodingFeature } = asObject(option)

  if (!geocodingFeature) {
    setLocation(geocodingFeature as GeocodingFeature)
  }
}

function setLocationFromTrending(option: Partial<GeocodingFeature>) {
  console.log('Set from trending', option)
}

function setLocation(option: GeocodingFeature) {
  addLocationToHistory(option)

  console.log('Set', JSON.parse(JSON.stringify(option)))
}

/**
 * Autocompletion
 */
const { autoComplete } = useMap();

watch(
  () => props.searchValue,
  async (newVal, oldVal) => {
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
  },
  { immediate: true }
)

/**
 * Trending locations
 */
const mockTrending = [
  { name: 'London', location: 'London, UK' },
  { name: 'New York', location: 'New York, USA' },
  { name: 'Tokyo', location: 'Tokyo, Japan' },
  { name: 'Sydney', location: 'Sydney, Australia' }
]
</script>

<style lang="scss">
.m-autocomplete-popover {
  background-color: var(--background-200);
  padding: var(--size-32);
  border-radius: var(--border-radius-2xl);

  &__spacer {
    margin-bottom: var(--size-32);
  }

  &__empty {
    padding: var(--size-16);
    background: var(--background-100);
    border-radius: var(--border-radius-xl);
    text-align: center;
  }
}

.pin--saved {
  color: var(--color-accent, #f39c12); // Use your accent color or any color you want for saved pins
}
</style>