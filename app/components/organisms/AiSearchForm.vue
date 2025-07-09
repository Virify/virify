<template>
  <form @submit.prevent="submitSearch" class="flow flow-lg">
    <!-- main header -->
    <h1 class="| title-lg font-bold">
      Find your perfect home with
      <span class="| gradient-text gradient-text-ai">AI</span>
      enhanced property search
    </h1>

    <!-- location group -->
    <div role="presentation" ref="$location" class="| flow flow-lg">
      <fieldset class="p-ai-search__location | elevate-200">
        <legend class="| visually-hidden">Location</legend>

        <input type="text" class="p-ai-search__location-input | body-md" placeholder="Where do you want to live?"
          aria-label="Location" v-model="locationQuery" @input="showPopover" @focus="showPopover" />

        <AtomsSelect name="radius" id="radius" aria-label="Location radius"
          class="p-ai-search__location-radius | body-md" v-model="selectedRadius" :options="radiusOptions" />
      </fieldset>

      <Transition name="p-ai-search__location">
        <div role="presentation" v-show="popoverExpanded">
          <MoleculesAutocompletePopover :searchValue="locationQuery" @location-selected="handleLocation" />
        </div>
      </Transition>
    </div>

    <div role="fieldset">
      <legend class="| visually-hidden">The property</legend>

      <!-- description query -->
      <MoleculesPromptbox :id="textareaId" placeholder="Describe your ideal property here..." v-model="searchQuery"
        @submit="submitSearch" />
    </div>

    <!-- example prompts -->
    <ul class="p-ai-search__filters-list">
      <li v-for="prompt of examplePrompts">
        <AtomsButtonPill variant="ghost" :content="prompt" icon="ai/prompt" icon-start
          @click.prevent="addPrompt(prompt)" />
      </li>
    </ul>
  </form>
</template>

<script setup lang="ts">
import { onClickOutside, useEventListener, templateRef } from '@vueuse/core'

const props = defineProps<{
  initialQuery?: string
  initialLocation?: GeocodingFeature | null
  initialRadius?: number | null
}>()

const emit = defineEmits(['submit-search'])

const { searchQuery } = useAi()
const selectedLocation = ref<GeocodingFeature | null>(null)
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

onMounted(() => {
  if (props.initialQuery) {
    searchQuery.value = props.initialQuery
  }
  if (props.initialLocation) {
    selectedLocation.value = props.initialLocation
    locationQuery.value = props.initialLocation.place_name_en
  }
  if (props.initialRadius) {
    selectedRadius.value = props.initialRadius
  }
})

const examplePrompts = [
  '4 bedroom house with a garden',
  'Studio flat with a balcony',
  '2+ bedroom property',
  '3 bedroom detached cottage with a downstairs bathroom',
  'A large parcel of land',
  '3 bedroom house with a garden and a garage'
]

function addPrompt(prompt: string) {
  searchQuery.value = prompt
  document?.getElementById(textareaId)?.focus()
}

function handleLocation(location: GeocodingFeature) {
  selectedLocation.value = location
  locationQuery.value = location.place_name_en
  hidePopover()
}

function submitSearch() {
  if (selectedLocation.value && searchQuery.value.trim()) {
    emit('submit-search', {
      location: selectedLocation.value,
      radius: selectedRadius.value,
      query: searchQuery.value
    })
  } else {
    // Optional: handle form validation feedback
    console.warn('Please select a location and enter a search query.')
  }
}

const popoverExpanded = ref(false)
const $location = templateRef<HTMLElement>('$location')

function showPopover() {
  popoverExpanded.value = true
}

function hidePopover() {
  popoverExpanded.value = false
}

onClickOutside($location, hidePopover)
</script>

<style lang="scss" scoped>
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

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
    border: 1px solid var(--border-color-100);

    @include mq.tablet {
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

    @include mq.tablet {
      border-radius: var(--border-radius-xl);
    }
  }

  &__location-input {
    padding: var(--size-4) var(--size-8);

    &:focus {
      outline: none;
    }

    @include mq.tablet {
      padding: var(--size-14) var(--size-16);
    }
  }

  &__location-radius {
    background-color: var(--background-100);
    border: 1px solid var(--border-color-200);
    padding: var(--size-14) var(--size-18);
    padding-right: var(--size-48);
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

/**
 *  Transitions
 */
.p-ai-search__location-enter-active,
.p-ai-search__location-leave-active {
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

.p-ai-search__location-leave-to,
.p-ai-search__location-enter-from {
  height: 0;
  margin: 0;

  >* {
    opacity: 0;
  }
}
</style>
