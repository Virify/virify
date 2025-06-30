<template>
  <div class="m-autocomplete-popover | flow elevate-200">
    <MoleculesAutocompleteSection v-if="searchValue" title="Suggestions">
      <MoleculesAutocompleteList v-if="locationSuggestions?.length" :options="locationSuggestions" icon="search/pin" />

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        No matches for "{{ searchValue }}"
      </p>

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>

    <MoleculesAutocompleteSection title="Saved locations">
      <MoleculesAutocompletePills v-if="userSavedLocations?.length" :options="userSavedLocations" icon="search/pin"
        pill-variant="pin" />

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        You do not currently have any saved locations
      </p>

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>


    <MoleculesAutocompleteSection v-if="locationHistory.length" title="History">
      <MoleculesAutocompleteList :options="locationHistory" icon="search/remove" variant="faded-icon" />

      <div role="separator" class="m-autocomplete-popover__spacer" />
    </MoleculesAutocompleteSection>


    <MoleculesAutocompleteSection v-if="mockTrending?.length" title="Trending locations">
      <MoleculesAutocompletePills :options="mockTrending" icon="search/trending" pill-variant="trending" />
    </MoleculesAutocompleteSection>
  </div>
</template>

<script setup lang="ts">
const { userSavedLocations } = useSavedLocation()

interface Props {
  searchValue: string
  locationSuggestions: GeocodingFeature[]
  locationHistory: GeocodingFeature[]
}

defineProps<Props>()

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
</style>