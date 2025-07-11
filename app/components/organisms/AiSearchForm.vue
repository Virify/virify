<template>
  <form ref="$form" @submit.prevent="submitSearch" class="unified-search-form" :class="{
    'is-collapsed': isCollapsed,
    'is-expanded': !isCollapsed,
    'has-searched': hasSearched
  }">

    <!-- Collapsed State Content -->
    <MoleculesAiSearchFormCollapsed v-show="isCollapsed" :query="segments"
      :query-location="selectedLocation?.place_name_en" :query-radius="selectedRadius" v-model:sort-order="sortOrder"
      v-model:search-radius="selectedRadius" @update-search-radius="submitSearch" @update-sort-order="updateSortOrder"
      @expand-form="isCollapsed = false" />

    <!-- Expanded State Content -->
    <div v-show="!isCollapsed" class="expanded-content">
      <div class="form-header">
        <h1 v-show="!hasSearched" class="| title-sm font-bold">
          Describe your dream home, let
          <span class="| gradient-text gradient-text-ai">AI</span>
          do the rest
        </h1>
        <button v-if="hasSearched" @click="isCollapsed = true" type="button" class="close-button">
          ✕
        </button>
      </div>

      <!-- location group -->
      <div role="presentation" ref="$location" class="location-group | flow flow-lg">
        <fieldset class="location-fieldset | elevate-200">
          <legend class="| visually-hidden">Location</legend>

          <input type="text" class="location-input | r-body-md-xs" placeholder="Where do you want to live?"
            aria-label="Location" v-model="locationQuery" @input="showPopover" @focus="showPopover" />

          <AtomsSelect name="radius" id="radius" aria-label="Location radius" class="location-radius | r-body-md-xs"
            v-model="selectedRadius" :options="selectOptionRadius" />
        </fieldset>

        <Transition name="location-popover">
          <div role="presentation" v-show="popoverExpanded">
            <MoleculesAutocompletePopover :searchValue="locationQuery" @location-selected="handleLocation" />
          </div>
        </Transition>
      </div>

      <div role="fieldset">
        <legend class="| visually-hidden">The property</legend>
        <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="searchQuery"
          @submit="submitSearch" />
      </div>

      <!-- example prompts -->
      <ul class="example-prompts">
        <li v-for="prompt of examplePrompts">
          <AtomsButtonPill variant="ghost" :content="prompt" icon="ai/prompt" icon-start
            @click.prevent="addPrompt(prompt)" />
        </li>
      </ul>

      <AtomsButton v-if="hasSearched || hasSavedState" @click.prevent="handleReset" type="reset"
        class="| button button-xs button-delete button-full button-bordered">
        Reset form
      </AtomsButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onClickOutside, templateRef } from "@vueuse/core";

const { geocodeAndSelectBest } = useMap();

const props = defineProps<{
  initialQuery?: string;
  initialLocation?: GeocodingFeature | null;
  initialRadius?: number | null;
  hasSearched: boolean;
  hasSavedState?: boolean;
}>();

const emit = defineEmits<{
  "submit-search": [payload: { location: GeocodingFeature; radius: number; query: string }];
  "update:collapsed": [value: boolean];
  "sort": [value: string];
  "reset": [];
}>();


// AI and query state
const { searchQuery, getAnalyzedQuery } = useAi();
const segments = computed(() => getAnalyzedQuery());

// UI state
const isCollapsed = ref(props.hasSearched);

const popoverExpanded = ref(false);
const locationError = ref("");
const textareaId = useId();
const $location = templateRef<HTMLElement>("$location");
const $form = templateRef<HTMLElement>("$form");

// Location state
const selectedLocation = ref<GeocodingFeature | null>(null);
const locationQuery = ref("");
const selectedRadius = ref(props.initialRadius || 0);

// Form validation
const isFormValid = computed(() => !!selectedLocation.value && !!searchQuery.value.trim());

const examplePrompts = [
  "4 bedroom house with a garden for sale",
  "Studio flat with a balcony to rent",
  "2+ bedroom property to buy",
  "3 bedroom detached cottage with a downstairs bathroom for sale",
  "A large parcel of land",
  "3 bedroom house with a garden and a garage"
];

// Watchers
watch(isCollapsed, (value) => emit("update:collapsed", value));

// Clear location error and reset selection when user types in location field
watch(locationQuery, () => {
  locationError.value = "";
  if (selectedLocation.value && locationQuery.value !== selectedLocation.value.place_name_en) {
    selectedLocation.value = null;
  }
});

// Initialize with props
const initializeFromProps = () => {
  if (props.initialQuery) searchQuery.value = props.initialQuery;
  if (props.initialLocation) {
    selectedLocation.value = props.initialLocation;
    locationQuery.value = props.initialLocation.place_name_en;
  }
};

onMounted(() => {
  initializeFromProps();
});

// Watch for prop changes (when values are restored from localStorage)
watch(() => props.initialQuery, (newQuery) => {
  if (newQuery) searchQuery.value = newQuery;
});

watch(() => props.initialLocation, (newLocation) => {
  if (newLocation) {
    selectedLocation.value = newLocation;
    locationQuery.value = newLocation.place_name_en;
  }
});

// Event handlers
const addPrompt = (prompt: string) => {
  searchQuery.value = prompt;
  document?.getElementById(textareaId)?.focus();
};

const handleLocation = (location: GeocodingFeature) => {
  selectedLocation.value = location;
  locationQuery.value = location.place_name_en;
  locationError.value = ""; // Clear any location error
  hidePopover();
};

const handleLocationEnter = async () => {
  console.log('[LOCATION ENTER] Pressed enter, locationQuery:', locationQuery.value);
  console.log('[LOCATION ENTER] Current selectedLocation:', selectedLocation.value);

  if (!selectedLocation.value && locationQuery.value.trim()) {
    console.log('[LOCATION ENTER] Attempting fallback geocoding');
    const geocodedLocation = await geocodeAndSelectBest(locationQuery.value);
    if (geocodedLocation) {
      console.log('[LOCATION ENTER] Geocoding successful:', geocodedLocation.place_name_en);
      selectedLocation.value = geocodedLocation;
      locationQuery.value = geocodedLocation.place_name_en;
      locationError.value = "";
      hidePopover();
    } else {
      console.log('[LOCATION ENTER] Geocoding failed');
      locationError.value = `Could not find location "${locationQuery.value}". Please select from suggestions or try a different location.`;
    }
  }
};

const submitSearch = async () => {
  console.log('[SUBMIT] Starting submit, searchQuery:', searchQuery.value);
  console.log('[SUBMIT] selectedLocation:', selectedLocation.value);
  console.log('[SUBMIT] locationQuery:', locationQuery.value);

  if (!searchQuery.value.trim()) return;

  // If no location is selected but we have a location query, try to geocode it
  if (!selectedLocation.value && locationQuery.value.trim()) {
    const geocodedLocation = await geocodeAndSelectBest(locationQuery.value);
    if (geocodedLocation) {
      selectedLocation.value = geocodedLocation;
      locationError.value = ""; // Clear any previous error
    } else {
      // Could not geocode the location, show error and don't proceed
      locationError.value = `Could not find location "${locationQuery.value}". Please select from suggestions or try a different location.`;
      return;
    }
  }

  // Ensure we have a location before submitting
  if (!selectedLocation.value) {
    locationError.value = "Please enter and select a location.";
    return;
  }

  // Clear any previous error and submit
  locationError.value = "";
  emit("submit-search", {
    location: selectedLocation.value,
    radius: selectedRadius.value,
    query: searchQuery.value,
  });

  isCollapsed.value = true;
};

const handleReset = () => {
  // Reset form fields
  searchQuery.value = "";
  selectedLocation.value = null;
  selectedRadius.value = 0;
  locationQuery.value = "";
  locationError.value = "";

  emit("reset");
};

/**
 *  Manage sort order
 */
const sortOrder = ref("relevance");

function updateSortOrder() {
  emit("sort", sortOrder.value)
}

/**
 *  Popover controls
 */
const showPopover = () => { popoverExpanded.value = true; };
const hidePopover = () => { popoverExpanded.value = false; };

onClickOutside($location, hidePopover);
onClickOutside($form, () => {
  if (!isCollapsed.value && props.hasSearched) {
    isCollapsed.value = true;
  }
});
</script>

<style lang="scss" scoped>
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

// Form wrapper
.ai-search-form-wrapper {
  position: relative;
  overflow-x: hidden;
  padding: var(--size-8);
  margin: calc(-1 * var(--size-8));
}

// Unified form that transitions between states
.unified-search-form {
  background: var(--background-200);
  border-radius: var(--border-radius-2xl);
  box-sizing: border-box;
  border: 1px solid var(--border-color-200);
  transition: all 0.3s ease;
  overflow: hidden;

  // Collapsed state
  &.is-collapsed {
    width: 100%;
    padding: var(--size-16);
    border-radius: var(--border-radius-2xl);
    margin: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    @include mq.tablet {
      padding: var(--size-16) var(--size-24);
    }

    .collapsed-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--size-12);
      cursor: pointer;
      min-height: var(--size-48);

      @include mq.tablet {
        gap: var(--size-16);
      }
    }
  }

  // Expanded state
  &.is-expanded {
    border-radius: var(--border-radius-3xl);
    padding: var(--size-24);
    margin-bottom: var(--size-24);
    max-width: var(--container-width, 1200px);
    margin-left: auto;
    margin-right: auto;
    max-height: 80vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-right: var(--size-12);

    // Mobile: pin to navigation (remove margin)
    @media (max-width: 768px) {
      margin-top: 0;
    }

    // Custom scrollbar styling
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      margin: var(--size-8) 0;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-color-200);
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--border-color-300);
      background-clip: content-box;
    }

    @include mq.tablet {
      padding: var(--size-32);
    }

    @include mq.desktop {
      max-width: 800px;
    }

    .expanded-content {
      display: flex;
      flex-direction: column;
      gap: var(--size-24);
    }
  }


  // Form header
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--size-16);
    position: relative;
  }

  // Location fieldset
  .location-fieldset {
    display: grid;
    padding: var(--size-16);
    gap: var(--size-16);
    background: var(--background-200);
    color: var(--foreground-100);
    border-radius: var(--border-radius-xl);
    align-items: center;
    border: 1px solid var(--border-color-200);

    @include mq.tablet {
      grid-template-columns: 1fr auto;
      border-radius: var(--border-radius-2xl);
    }

    &:has(input:focus) {
      outline: var(--focus-outline);
    }
  }

  .location-radius,
  .location-input {
    background-color: transparent;
    color: currentColor;
    border-radius: var(--border-radius-lg);

    @include mq.tablet {
      border-radius: var(--border-radius-xl);
    }
  }

  .location-input {
    padding: var(--size-4) var(--size-8);

    &:focus {
      outline: none;
    }

    @include mq.tablet {
      padding: var(--size-14) var(--size-16);
    }
  }

  .location-radius {
    background-color: var(--background-100);
    border: 1px solid var(--border-color-200);
    padding: var(--size-14) var(--size-18);
    padding-right: var(--size-48);
    margin: 0;
  }
}

.close-button {
  position: absolute;
  top: -20px;
  right: 10px;
  width: var(--size-32);
  height: var(--size-32);
  padding: 0;
  background-color: var(--background-200);
  color: var(--foreground-100);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;

  @media(max-width: 660px) {
    top: -15px;
  }
}

.example-prompts {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  gap: 8px;
  flex: 1;
}

// Collapsed state styles
.collapsed-top-row {
  display: flex;
  align-items: center;
  gap: var(--size-16);
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--size-12);
    align-items: stretch;
    position: relative;
  }
}

.collapsed-actions {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  flex-shrink: 0;

  @include mq.tablet {
    gap: var(--size-16);
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
}

// Location popover transitions
.location-popover-enter-active,
.location-popover-leave-active {
  interpolate-size: allow-keywords;
  height: calc-size(max-content, size);
  transition-property: height, margin;
  transition-duration: var(--animation-slow);
  transition-timing-function: var(--ease-out);
  overflow: hidden;
  box-sizing: border-box;

  >* {
    transition-property: opacity;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-out);
  }
}

.location-popover-leave-to,
.location-popover-enter-from {
  height: 0;
  margin: 0;

  >* {
    opacity: 0;
  }
}
</style>
