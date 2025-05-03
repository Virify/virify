<template>
  <form class="o-searchform | flow flow-sm relative" ref="$form" @keydown.escape="hidePopover">
    <MoleculesSwitcher class="o-searchform-buyrent" legend="Buy or rent" :options="buyOrRentOptions"
      v-model="buyOrRent" />

    <div class="o-searchform-banner">
      <input type="search" placeholder="Location" class="o-searchform-banner-input" required @click="showPopover"
        @focus="showPopover" @input="showPopover" v-model="suggestions" />

      <select class="o-searchform-banner-select">
        <option v-for="{ key, value } of radiusOptions" :key :value>{{ key }}</option>
      </select>

      <button type="button" class="o-searchform-banner-button | button button-monochrome">
        <AtomsIcon title="Search" icon="search" class="o-searchform-banner-button-icon" />
      </button>
    </div>

    <div class="o-searchform-popover | container container-md elevate-300" :hidden="popoverHidden">
      <OrganismsSearchFormPopover>
        <div v-if="suggestions" class="o-searchform-autocomplete" role="presentation">
          <div role="presentation">
            <h2 class="| title-sm">Locations</h2>

            <MoleculesAutocomplete :input="suggestions" :matches="suggestionsMatches"
              v-slot="{ original, current, suggestion }">
              <button class="o-searchform-autocomplete-button | body-md"
                @click.prevent="setSelectedSuggestion(original)">
                <strong class="o-searchform-autocomplete-button-highlight">{{ current }}</strong>{{ suggestion }}
              </button>
            </MoleculesAutocomplete>
          </div>

          <div class="o-searchform-map | title-2xl">
            Map
          </div>
        </div>

        <div role="presentation" class="| flow flow-md">
          <h2 class="| title-sm">Property type</h2>

          <MoleculesScrollBox class="| focus-overflow">
            <ul class="o-searchform-property-types">
              <li v-for="label of propertType">
                <AtomsToggleBox :label type="checkbox" name="property-type" v-model="selectedPropertyType[label]" />
              </li>
            </ul>
          </MoleculesScrollBox>
        </div>

      </OrganismsSearchFormPopover>
    </div>
  </form>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

/**
 *  Popover management
 */
const $form = useTemplateRef('$form')

// Track state of form
const popoverHidden = ref(true)

// Show/hide form if appropriate
function togglePopoverHidden(setHidden = false) {
  if (popoverHidden.value === setHidden) return

  popoverHidden.value = setHidden
}

// Show form
function showPopover() {
  togglePopoverHidden(false)
}

// Hide form
function hidePopover() {
  togglePopoverHidden(true)
}

// Hide form on click outside
onClickOutside($form, () => {
  hidePopover(true)
})

/**
 *  Search typed
 */
const suggestions = ref('')

function setSelectedSuggestion(newValue) {
  suggestions.value = newValue
}

/**
 *  Search radius
 */
const radiusOptions = [
  { value: '0', key: 'This location only' },
  { value: '0.25', key: 'Within 0.25 miles' },
  { value: '0.5', key: 'Within 0.5 miles' },
  { value: '1', key: 'Within 1 mile' },
  { value: '2', key: 'Within 2 miles' },
  { value: '5', key: 'Within 5 miles' },
  { value: '10', key: 'Within 10 miles' },
  { value: '20', key: 'Within 20 miles' },
  { value: '40', key: 'Within 40 miles' }
]

/**
 *  Buy or rent
 */
const buyOrRent = ref('buy')

const buyOrRentOptions = [
  { key: 'buy', value: 'Buy' },
  { key: 'rent', value: 'Rent' },
  { key: 'price', value: 'House prices' },
]

/**
 *  Property type
 */
const propertType = [
  'Detached',
  'Semi-detached',
  'Terraced',
  'End-terrace',
  'Flat',
  'Cottage',
  'Bungalow',
]

const selectedPropertyType = reactive<Record<string, boolean>>({
  'Detached': true,
  'Semi-detached': true,
  'Terraced': true,
  'End-terrace': true
})

/**
 *  Mock autocomplete
 */
const suggestionsMatches = computed(() => {
  // Avoid case sensitivity
  const suggestionsLower = suggestions.value.toLowerCase()

  // Mock filter
  return [
    'Stevenage, Hertfordshire',
    'Steventon, Oxford',
    'St. Albans, Hertforshire',
    'St. Neots, Hertfordshire',
    'Stoke-on-Trent, Staffordshire',
    'Stepps, Glasgow',
    'Stepney, London',
    'Stockwell, London',
    'Stratford, London',
    'South London',
    'South West London'
  ].filter(str => {
    const strLower = str.toLowerCase()

    return strLower.startsWith(suggestionsLower)
  }).slice(0, 5)
})
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.o-searchform {
  max-width: 32em;
  margin: 0 auto;
}

.o-searchform-buyrent {
  background: fn.faded-color(12%, var(--primary-700));
  backdrop-filter: blur(10px);
  color: var(--monochrome-900);
}

.o-searchform-banner {
  display: flex;
  align-items: center;
  gap: var(--size-12);
  padding: var(--size-12);
}

.o-searchform-banner-input,
.o-searchform-banner-selected {
  width: auto;
  min-width: 0;
  height: 100%;

  &:focus {
    outline: none;
  }
}

.o-searchform-banner-input {
  flex: 1 1 min-content;
  padding-inline-start: var(--size-14);
}

.o-searchform-banner-selected {
  flex: 0 1 min-content;
}

.o-searchform-banner-button {
  width: var(--size-56);
  height: var(--size-56);
  padding: 0;
  flex-shrink: 0;
  border-radius: var(--border-radius-ui);
}

.o-searchform-banner-button-icon {
  width: var(--size-24);
  height: var(--size-24);
}

.o-searchform-banner,
.o-searchform-popover {
  background: var(--background-200);
  color: var(--foreground-100);
  border-radius: var(--border-radius-xl);
}

.o-searchform-popover {
  position: absolute;
  top: calc(100% + var(--size-12));
  left: 50%;
  transform: translateX(-50%);
  width: min(100vw - var(--size-72), 42em);
  padding: var(--size-32);
  text-align: left;
  overflow: hidden;
}

.o-searchform-autocomplete {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--size-32);
}

.o-searchform-autocomplete-button {
  display: block;
  width: 100%;
  padding: var(--size-8) var(--size-14);
  border-radius: var(--border-radius-ui);
  cursor: pointer;
  text-align: left;
  color: currentColor;
  background-color: transparent;
  transition: background-color var(--animation-fast);
}

.o-searchform-autocomplete-button:hover {
  background: fn.faded-color(8%);
  color: var(--foreground-100);
}

.o-searchform-property-types {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
  gap: var(--size-8);
  white-space: nowrap;
}

.o-searchform-map {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--monochrome-800);
  color: var(--monochrome-600);
  border-radius: var(--border-radius-ui);
  aspect-ratio: 1;
}


/**
 *  Open animatinos
 */
@starting-style {
  .o-searchform-popover {
    opacity: 0;
    transform: translateX(-50%) translateY(-1em)
  }
}

.o-searchform-popover {
  display: block;
  transition: opacity var(--animation-fast) ease-out, transform var(--animation-fast) ease-out;
}
</style>