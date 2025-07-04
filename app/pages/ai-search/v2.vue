<template>
  <div class="| container container-sm flow flow-lg">
    <!-- main header -->
    <h1 class="| title-xl font-bold">
      Find your perfect home with
      <span class="| gradient-text gradient-text-ai">AI</span>
      enhanced property search
    </h1>

    <!-- location group -->
    <fieldset class="p-ai-search__location | elevate-200">
      <legend class="| visually-hidden">Location</legend>

      <input type="text" class="p-ai-search__location-input | body-md"
        placeholder="Search for properties, locations, or features..." aria-label="Location" v-model="locationQuery"
        @input="showPopover" @focus="showPopover" />

      <AtomsSelect name="radius" id="radius" aria-label="Location radius" class="p-ai-search__location-radius | body-md"
        v-model="selectedRadius" :options="radiusOptions" />

    </fieldset>

    <MoleculesAutocompletePopover :hidden="!popoverExpanded" :searchValue="locationQuery"
      @location-selected="handleLocation" />

    <!-- description title -->
    <h2 class="| title-xs">Description</h2>

    <!-- description query -->
    <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="searchQuery"
      @submit="handleSearch()" />

    <!-- example prompts -->
    <ul class="p-ai-search__filters-list">
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

  hidePopover()
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

/**
 *  Popover toggle
 */
const popoverExpanded = ref(false)

function showPopover() {
  popoverExpanded.value = true
}

function hidePopover() {
  popoverExpanded.value = false
}
</script>

<style lang="scss" scoped>
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

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

.p-ai-search {

  &__location {
    display: grid;
    padding: var(--size-16);
    gap: var(--size-16);
    background: var(--background-200);
    color: var(--foreground-100);
    border-radius: var(--border-radius-xl);
    align-items: stretch;

    @include mq.small-tablet {
      grid-template-columns: 1fr auto;
      border-radius: var(--border-radius-2xl);
    }

    &:has(input:focus) {
      outline: var(--focus-outline);
    }
  }

  &__location-radius,
  &__location-input {
    background-color: transparent;
    color: currentColor;
    border-radius: var(--border-radius-lg);
    padding: var(--size-14) var(--size-16);

    @include mq.small-tablet {
      border-radius: var(--border-radius-xl);
    }
  }

  &__location-input {

    &:focus {
      outline: none;
    }
  }

  &__location-radius {
    border: 1px solid var(--border-color-200);
    padding-right: var(--size-40);
    margin: 0;
  }

  &__filters-list {
    margin: var(--size-24) 0;
    gap: var(--size-8);
  }
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
</style>