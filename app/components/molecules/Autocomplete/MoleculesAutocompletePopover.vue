<template>
  <div class="m-autocomplete-popover | flow">
    <MoleculesAutocompleteSection v-if="mockAutoComplete" title="Suggestions">
      <MoleculesAutocompleteList :options="mockAutoComplete" icon="search/pin" />
    </MoleculesAutocompleteSection>

    <div role="separator" class="m-autocomplete-popover__spacer" />

    <MoleculesAutocompleteSection v-if="mockSavedLocations" title="Saved locations">
      <MoleculesAutocompletePills :options="mockSavedLocations" icon="search/pin" pill-variant="pin" />
    </MoleculesAutocompleteSection>

    <div role="separator" class="m-autocomplete-popover__spacer" />

    <MoleculesAutocompleteSection v-if="mockHistory" title="History">
      <MoleculesAutocompleteList :options="mockHistory" icon="search/remove" variant="faded-icon" />
    </MoleculesAutocompleteSection>

    <div role="separator" class="m-autocomplete-popover__spacer" />

    <MoleculesAutocompleteSection v-if="mockTrending" title="Trending">
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

const mockSavedLocations = [
  { name: 'Home', location: '123 Home Street, United Kingdom' },
  { name: 'Near work', location: '123 Work Street, United Kingdom' },
  { name: 'Amazing place 1', location: 'Amazing Place 1' },
  { name: 'And another', location: 'Another Place' },
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
  border-radius: var(--border-radius-xl);

  &__spacer {
    margin-bottom: var(--size-32);
  }
}
</style>