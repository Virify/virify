<template>
  <div class="| container container-sm flow flow-lg">
    <!-- main header -->
    <h1 class="| title-xl font-bold">
      Find your perfect home with
      <span class="| gradient-text gradient-text-ai">AI</span>
      enhanced property search
    </h1>
    <!-- location group -->
    <div class="location-input-group">
      <div class="location-input-wrapper">
        <!-- location input -->
        <input type="text" class="location-input" placeholder="Search for properties, locations, or features..."
          aria-label="Search for properties, locations, or features" v-model="locationQuery" />
      </div>
      <!-- radius -->
      <select name="radius" id="radius" class="radius-select" v-model="selectedRadius">
        <option v-for="option in radiusOptions" :key="option.value" :value="option.value">
          {{ option.key }}
        </option>
      </select>
    </div>

    <MoleculesAutocompletePopover :searchValue="locationQuery" @selected-location="handleLocation" @selected-saved-location="handleSavedLocation" />


    <!-- description title -->
    <h2 class="| title-xs">Description</h2>

    <!-- description query -->
    <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="searchQuery"
      @submit="handleSearch()" />

    <!-- example prompts -->
    <ul class="filters-list">
      <li v-for="prompt of examplePrompts">
        <AtomsButtonPill variant="ghost" :content="prompt" icon="ai/prompt" icon-start
          @click.prevent="addPrompt(prompt)" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const selectedLocation = ref<GeocodingFeature | null>(null)
const { aiSearch, searchQuery } = useAi()
const textareaId = useId()
const locationQuery = ref("")

const radiusOptions = [
  { value: 0, key: "This location only" },
  { value: 0.25, key: "Within 0.25 miles" },
  { value: 0.5, key: "Within 0.5 miles" },
  { value: 1, key: "Within 1 mile" },
  { value: 2, key: "Within 2 miles" },
  { value: 5, key: "Within 5 miles" },
  { value: 10, key: "Within 10 miles" },
  { value: 20, key: "Within 20 miles" },
  { value: 40, key: "Within 40 miles" },
];

const selectedRadius = ref(0)

/**
 * Add a prompt to the textarea
 * @param prompt Prompt to add
 */
const examplePrompts = [
  '4 bedroom house with a garden',
  'Studio flat with a balcony',
  '2+ bedroom property',
  '3 bedroom detached cottage with a downstairs bathroom',
  'A large parcel of land',
  '3 bedroom house with a garden and a garage'
]

/**
 * Add a prompt to the textarea
 * @param prompt Prompt to add
 */
function addPrompt(prompt: string) {
  searchQuery.value = prompt

  document?.getElementById(textareaId)?.focus()
}

/**
 * Handle location selection
 * @param location Selected location from autocomplete
 * Sets the selected location and updates the location query
 */
function handleLocation(location: GeocodingFeature) {
  selectedLocation.value = location
  locationQuery.value = location.place_name_en
}

/**
 * 
 * @param location Selected saved location
 * Handles the selection of a saved location
 * @returns void
 */
function handleSavedLocation(location: UserSavedLocation | { name: string; location: string }) {
  console.log('Selected saved location:', location)
  locationQuery.value = location.location
}

/**
 * Handle search action
 * Calls the AI search function with the selected location and radius
 */
async function handleSearch() {
  if (selectedLocation.value) {
    const results = await aiSearch(selectedLocation.value, selectedRadius.value)
    console.log('Search results:', results)
  } else {
    console.warn('No location selected for search.')
  }
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/functions' as fn;

h2 {
  max-width: 42ch;
}

ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: var(--size-10) 0;
}

.location-input-group {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: var(--size-10);
  margin-bottom: var(--size-20);
  align-items: flex-start;
}

.location-input {
  padding: var(--size-10) var(--size-14);
  border: 1px solid var(--border-color-200);
  border-radius: var(--border-radius-lg);
  background: var(--background-200);
  width: 100%;
  color: inherit;
  font: inherit;
}

.suggestion-item {
  width: 100%;
  padding: var(--size-10) var(--size-14);
  background: var(--background-200);
  cursor: pointer;

  &:hover {
    background: var(--secondary-400);
    color: var(--monochrome-900);
  }
}

.radius-select {
  padding: var(--size-12) var(--size-14);
  border: 1px solid var(--border-color-200);
  border-radius: var(--border-radius-lg);
  background: var(--background-200);
  color: inherit;
  font: inherit;
}

.filters-list {
  gap: var(--size-8);
}
</style>