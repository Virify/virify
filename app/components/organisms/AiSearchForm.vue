<template>
  <form ref="$form" @submit.prevent="submitSearch" class="unified-search-form" :class="{
    'is-collapsed': isCollapsed,
    'is-expanded': !isCollapsed,
    'has-searched': hasSearched
  }">

    <!-- Collapsed State Content -->
    <MoleculesSearchFormCollapsed v-show="isCollapsed" :query="segments"
      :query-location="selectedLocation?.place_name_en" :query-radius="selectedRadius" v-model:sort-order="sortOrder"
      :sort-options="sortOptions" @update-sort-order="updateSortOrder" @expand-form="isCollapsed = false" />

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
            v-model="selectedRadius" :options="radiusOptions" />
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
const textareaId = useId();
const $location = templateRef<HTMLElement>("$location");
const $form = templateRef<HTMLElement>("$form");

// Location state
const selectedLocation = ref<GeocodingFeature | null>(null);
const locationQuery = ref("");
const selectedRadius = ref(0);

// Options data
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

const sortOptions = [
  { value: "relevance", key: "Sort by Relevance" },
  { value: "price-asc", key: "Price: Low to High" },
  { value: "price-desc", key: "Price: High to Low" },
  { value: "date-desc", key: "Newest First" },
  { value: "date-asc", key: "Oldest First" },
];

const examplePrompts = [
  "4 bedroom house with a garden for sale",
  "Studio flat with a balcony to rent",
  "2+ bedroom property",
  "3 bedroom detached cottage with a downstairs bathroom for sale",
  "A large parcel of land",
  "3 bedroom house with a garden and a garage"
];

// Watchers
watch(isCollapsed, (value) => emit("update:collapsed", value));

// Initialize with props
const initializeFromProps = () => {
  if (props.initialQuery) searchQuery.value = props.initialQuery;
  if (props.initialLocation) {
    selectedLocation.value = props.initialLocation;
    locationQuery.value = props.initialLocation.place_name_en;
  }
  if (props.initialRadius) selectedRadius.value = props.initialRadius;
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

watch(() => props.initialRadius, (newRadius) => {
  if (newRadius !== null && newRadius !== undefined) {
    selectedRadius.value = newRadius;
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
  hidePopover();
};

const submitSearch = () => {
  if (!selectedLocation.value || !searchQuery.value.trim()) return;

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

// Form controls
.expand-button {
  color: var(--secondary-400);
  width: var(--size-48);
  height: var(--size-48);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border: none !important;
  margin-left: auto;
  flex-shrink: 0;
}

.expand-button-mobile {
  display: none; // Hidden on desktop

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    top: -15px;
    right: -10px;
    width: var(--size-48);
    height: var(--size-48);
    padding: 0;
    align-items: center;
    justify-content: center;
    background: transparent !important;
    border: none !important;
    color: var(--secondary-400);
    z-index: 1;
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

    .expand-button {
      display: none;
    }
  }
}

.sort-select {
  min-width: 120px;
  width: auto;
  background-color: var(--background-100);
  border: 1px solid var(--border-color-200);
  padding: var(--size-10) var(--size-12);
  padding-right: var(--size-36);
  margin: 0;
  border-radius: var(--border-radius-lg);
}

.radius-select {
  min-width: 140px;
  width: auto;
  background-color: var(--background-100);
  border: 1px solid var(--border-color-200);
  padding: var(--size-10) var(--size-12);
  padding-right: var(--size-36);
  margin: 0;
  border-radius: var(--border-radius-lg);
}


.query-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  min-width: 0;
  flex: 1;
  gap: var(--size-4);
}

// Query display text
.query-info,
.location-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;

  @media (max-width: 768px) {
    white-space: normal;
  }
}

.query-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;

  .segment--used {
    color: var(--secondary-400);
  }

  .segment--ignored {
    text-decoration: line-through;
    opacity: 0.5;
  }

  @media(max-width: 768px) {
    white-space: normal;
    line-height: var(--text-sm--line-height);
    padding-right: var(--size-32);
  }
}

.location-text {
  opacity: 0.7;

  @media(max-width: 768px) {
    margin-top: var(--size-4);
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
