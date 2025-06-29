<template>
  <div class="m-autocomplete-popover | flow elevate-200">
    <MoleculesAutocompleteSection title="Suggestions">
      <MoleculesAutocompleteList v-if="mockAutoComplete?.length" :options="mockAutoComplete" icon="search/pin" />

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        No matches for "search params"
      </p>
    </MoleculesAutocompleteSection>

    <div role="separator" class="m-autocomplete-popover__spacer" />

    <MoleculesAutocompleteSection title="Saved locations">
      <MoleculesAutocompletePills v-if="mockSavedLocations?.length" :options="mockSavedLocations" icon="search/pin"
        pill-variant="pin" />

      <p v-else class="m-autocomplete-popover__empty | faded-text body-md">
        You do not currently have any saved locations
      </p>
    </MoleculesAutocompleteSection>

    <div role="separator" class="m-autocomplete-popover__spacer" />

    <MoleculesAutocompleteSection v-if="mockHistory?.length" title="History">
      <MoleculesAutocompleteList :options="mockHistory" icon="search/remove" variant="faded-icon" />
    </MoleculesAutocompleteSection>

    <div role="separator" class="m-autocomplete-popover__spacer" />

    <MoleculesAutocompleteSection v-if="mockTrending?.length" title="Trending locations">
      <MoleculesAutocompletePills :options="mockTrending" icon="search/trending" pill-variant="trending" />
    </MoleculesAutocompleteSection>
  </div>
</template>

<script setup lang="ts">
const mockAutoComplete = [
  'Cardiff, Castle, Cardiff, United Kingdom',
  'Cardigan, Cardigan, Ceredigion, United Kingdom',
  'Cardross, Argyll and Bute, United Kingdom',
  'Cardonald, Glasgow City, United Kingdom',
  'Cardiff, United Kingdom'
]

const mockHistory = [
  'Lonsdale Road, Stevenage, Hertfordshire, United Kingdom',
  'Camden High Street, Camden, London, United Kingdom'
]

const mockSavedLocations: string[] = [
  // { name: 'Home', location: '123 Home Street, United Kingdom' },
  // { name: 'Near work', location: '123 Work Street, United Kingdom' },
  // { name: 'Amazing place 1', location: 'Amazing Place 1' },
  // { name: 'And another', location: 'Another Place' },
]

const mockTrending = [
  { name: 'London', location: 'London, United Kingdom' },
  { name: 'Camden', location: 'Camden, United Kingdom' },
  { name: 'Edinburgh', location: 'Edinburgh, United Kingdom' },
  { name: 'PO19 1FE', location: 'PO19 1FE' },
  { name: 'Manchester', location: 'Manchester, United Kingdom' },
  { name: 'Bristol', location: 'Bristol, United Kingdom' }
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