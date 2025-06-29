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
          aria-label="Search for properties, locations, or features" v-model="locationQuery"
          @input="onLocationInput()" />
        <!-- location suggestion -->
        <ul v-if="locationSuggestions.length" class="location-suggestions">
          <li v-for="suggestion in locationSuggestions" :key="suggestion.place_name_en" class="suggestion-item"
            @click="selectLocation(suggestion)">
            {{ suggestion.place_name_en }}
          </li>
        </ul>
      </div>
      <!-- radius -->
      <select name="radius" id="radius" class="radius-select" v-model="selectedRadius">
        <option v-for="option in radiusOptions" :key="option.value" :value="option.value">
          {{ option.key }}
        </option>
      </select>
    </div>

    <!-- location history -->
    <client-only>
      <div v-if="locationHistory.length > 0">
        <h2 class="| title-xs">Location History</h2>
        <ul class="filters-list">
          <li v-for="location of locationHistory" :key="location.place_name_en">
            <AtomsButtonPill variant="ghost" :content="location.place_name_en" icon="ai/prompt" icon-start
              @click.prevent="selectLocation(location)" />
          </li>
          <li>
            <AtomsButtonPill variant="ghost" content="Clear history" icon="cross" icon-start
              @click.prevent="locationHistory = []" />
          </li>
        </ul>
      </div>
    </client-only>

    <!-- saved locations -->
      <div class="saved-locations" v-if="userSavedLocations.length > 0">
        <h2 class="| title-xs">Saved Locations</h2>
        <ul class="filters-list">
          <li v-for="location of userSavedLocations" :key="location.id">
            <AtomsButtonPill variant="ghost" :content="location.location" icon="ai/prompt" icon-start
            @click.prevent="selectLocation(location.geocodingFeature)" />
        </li>
      </ul>
    </div>


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
import { useStorage } from '@vueuse/core'
const { autoComplete } = useMap()
const { userSavedLocations } = useSavedLocation()
const { aiSearch, searchQuery } = useAi()
const textareaId = useId()
const locationQuery = ref("")
const locationSuggestions = ref<GeocodingFeature[]>([]);
const selectedLocation = ref<GeocodingFeature | null>(null)
const locationHistory = useStorage<GeocodingFeature[]>('searchLocationHistory', []);

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
 * Handle location input changes
 * Fetches location suggestions based on the input query
 * Only triggers if the query is longer than 2 characters
 */
const onLocationInput = async () => {
  // Handle location input changes if needed
  const query = locationQuery.value.trim()
  if (query && query.length > 2) {
    const results = await autoComplete(query)
    locationSuggestions.value = results
  }
}

/**
 * Select a location suggestion
 * @param suggestion Selected location suggestion
 */
function selectLocation(suggestion: GeocodingFeature) {
  locationQuery.value = suggestion.place_name_en;
  selectedLocation.value = suggestion;
  locationSuggestions.value = [];
  if (!locationHistory.value.some(loc => loc.place_name_en === suggestion.place_name_en)) {
    if( locationHistory.value.length >= 5) {
      locationHistory.value.shift();
    }
    locationHistory.value.push(suggestion);
  }
}

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