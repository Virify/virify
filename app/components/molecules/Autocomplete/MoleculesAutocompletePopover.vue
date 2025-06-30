<template>
  <div class="m-autocomplete-popover | flow elevate-200">
    <MoleculesAutocompleteSection v-if="searchValue" title="Suggestions">
      <MoleculesAutocompleteList
        v-if="locationSuggestions?.length"
        :options="locationSuggestions"
        icon="search/pin"
        @selectedLocation="selectLocation"
      />

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        No matches for "{{ searchValue }}"
      </p>

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>

    <MoleculesAutocompleteSection title="Saved locations">
      <MoleculesAutocompletePills v-if="userSavedLocations?.length" :options="userSavedLocations" icon="search/pin"
        pill-variant="pin" @selected-saved-location="selectSavedLocation" />

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        You do not currently have any saved locations
      </p>

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>

    <ClientOnly>
      <MoleculesAutocompleteSection v-if="locationHistory.length" title="History">
        <MoleculesAutocompleteList :options="locationHistory" icon="search/remove" variant="faded-icon" @removeHistory="removeFromLocationHistory" @selected-location="selectLocation" />

        <div role="separator" class="m-autocomplete-popover__spacer" />
      </MoleculesAutocompleteSection>
    </ClientOnly>


    <MoleculesAutocompleteSection v-if="mockTrending?.length" title="Trending locations">
      <MoleculesAutocompletePills :options="mockTrending" icon="search/trending" pill-variant="trending" />
    </MoleculesAutocompleteSection>
  </div>
</template>

<script setup lang="ts">
const { userSavedLocations, locationHistory, addLocationToHistory, removeFromLocationHistory } = useSavedLocation();
const { autoComplete } = useMap();
const locationSuggestions = ref<GeocodingFeature[]>([]);
const suppressAutocomplete = ref(false);

interface Props {
  searchValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'selectedLocation', value: GeocodingFeature): void
  (e: 'selectedSavedLocation', value: UserSavedLocation | { name: string; location: string }): void
}>()

const mockTrending = [
  { name: 'London', location: 'London, UK' },
  { name: 'New York', location: 'New York, USA' },
  { name: 'Tokyo', location: 'Tokyo, Japan' },
  { name: 'Sydney', location: 'Sydney, Australia' }
]

/**
 * Select a location from the autocomplete suggestions
 * @param location The selected location from the autocomplete
 * Clears the suggestions and adds the location to history
 * Emits the selected location to the parent component
 */
const selectLocation = (location: GeocodingFeature) => {
  locationSuggestions.value = [];
  addLocationToHistory(location);
  emit('selectedLocation', location);
  suppressAutocomplete.value = true;
}

/**
 * Select a saved location from the pills
 * @param location The selected saved location
 * Emits the selected saved location to the parent component
 */
const selectSavedLocation = (location: UserSavedLocation | { name: string; location: string }) => {
  emit('selectedSavedLocation', location);
  suppressAutocomplete.value = true;
}

/**
 * Remove a location from the history
 * @param location The location to remove
 */
watch(
  () => props.searchValue,
  async (newVal, oldVal) => {
    if (suppressAutocomplete.value) {
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
</style>