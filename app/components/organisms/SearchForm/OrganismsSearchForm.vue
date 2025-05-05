<template>
  <form class="o-searchform | flow flow-sm relative" ref="$form" autocomplete="off" @keydown.escape="hidePopover"
    @submit.prevent="sendForm">
    <MoleculesSwitcher class="o-searchform-buyrent" legend="Buy or rent" :options="buyOrRentOptions" v-model="buyOrRent"
      name="buyOrRent" />

    <div class="o-searchform-banner">
      <input type="search" placeholder="Location" aria-label="Location to search in" class="o-searchform-banner-input"
        required @click="showPopover" @focus="showPopover" @input="showPopover" v-model="suggestions" name="location" />

      <button type="submit" class="o-searchform-banner-button | button button-monochrome">
        <AtomsIcon title="Search" icon="search" class="o-searchform-banner-button-icon" />
      </button>
    </div>

    <OrganismsSearchFormPopover class="o-searchform-popover | container container-md elevate-300"
      :hidden="popoverHidden">
      <MoleculesErrorBox v-if="formErrors" :error="formErrors" />

      <div v-if="suggestions" class="o-searchform-autocomplete">
        <OrganismsSearchFormTitleBlock title="Location">
          <MoleculesAutocomplete :input="suggestions" :matches="suggestionsMatches"
            v-slot="{ original, current, suggestion }">
            <button class="o-searchform-autocomplete-button | body-md" @click.prevent="setSelectedSuggestion(original)">
              <strong class="o-searchform-autocomplete-button-highlight">{{ current }}</strong>{{ suggestion }}
            </button>
          </MoleculesAutocomplete>
        </OrganismsSearchFormTitleBlock>

        <div role="presentation" class="| flow flow-md">
          <MoleculesFormField label="Search radius" v-slot="{ id }">
            <select :id class="| text-input focus-visible" name="radius">
              <option v-for="{ key, value }, index of radiusOptions" :key="value" :value :selected="index === 0">{{
                key
                }}
              </option>
            </select>
          </MoleculesFormField>

          <div class="o-searchform-map | title-2xl">Map</div>
        </div>
      </div>

      <OrganismsSearchFormTitleBlock title="Property type">
        <MoleculesScrollBox class="| focus-overflow">
          <ul class="o-searchform-property-types">
            <li v-for="{ id, name, defaultSelected } of propertyTypes" :key="id">
              <AtomsToggleBox :label="name" :checked="defaultSelected" type="checkbox" :name />
            </li>
          </ul>
        </MoleculesScrollBox>
      </OrganismsSearchFormTitleBlock>

      <OrganismsSearchFormTitleBlock title="Price">
        <LazyMoleculesRangeSlider hydrate-on-visible />
      </OrganismsSearchFormTitleBlock>
    </OrganismsSearchFormPopover>
  </form>
</template>

<script setup lang="ts">
import type { PropertyType } from '@prisma/client';
import { onClickOutside } from '@vueuse/core';

/**
 *  Popover management
 */
const $form = useTemplateRef('$form');
const searchListings = inject<Ref<ListingWithFullProperty[] | null>>('searchListings');

// Track state of form
const popoverHidden = ref(true);

// Show/hide form if appropriate
function togglePopoverHidden(setHidden = false) {
  if (popoverHidden.value === setHidden) return;

  popoverHidden.value = setHidden;
}

// Show form
function showPopover() {
  togglePopoverHidden(false);
}

// Hide form
function hidePopover() {
  togglePopoverHidden(true);
}

// Hide form on click outside
onClickOutside($form, () => {
  hidePopover();
});

/**
 *  Block native form validation on mount
 */
onMounted(async () => {
  if ($form.value) {
    $form.value.setAttribute('novalidate', 'novalidate')
  }
});

/**
 *  Search typed
 */
const suggestions = ref('');

function setSelectedSuggestion(newValue: string) {
  suggestions.value = newValue;
}

/**
 *  Search radius
 */
const radiusOptions = [
  { value: 0, key: 'This location only' },
  { value: 0.25, key: 'Within 0.25 miles' },
  { value: 0.5, key: 'Within 0.5 miles' },
  { value: 1, key: 'Within 1 mile' },
  { value: 2, key: 'Within 2 miles' },
  { value: 5, key: 'Within 5 miles' },
  { value: 10, key: 'Within 10 miles' },
  { value: 20, key: 'Within 20 miles' },
  { value: 40, key: 'Within 40 miles' },
];

/**
 *  Buy or rent
 */
const buyOrRent = ref('buy');

const buyOrRentOptions = [
  { key: 'buy', value: 'Buy' },
  { key: 'rent', value: 'Rent' },
  // { key: 'price', value: 'Prices' },
];

/**
 *  Property type
 */
const propertyTypes = await $fetch<PropertyType[]>('/api/property-type/all')

/**
 *  Mock autocomplete
 */
const suggestionsMatches = computed(() => {
  // Avoid case sensitivity
  const suggestionsLower = suggestions.value.toLowerCase();

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
    'South West London',
  ]
    .filter((str) => {
      const strLower = str.toLowerCase();

      return strLower.startsWith(suggestionsLower);
    })
    .slice(0, 5);
});

/**
 *  Submit form
 */
const formErrors = ref();

watch(suggestions, (newValue) => {
  if (!formErrors.value || !newValue) return;

  formErrors.value = null;
});

async function sendForm({ target }: SubmitEvent) {
  const { formData, errors } = useFormData(target);

  // If any errors exist, terminate and display
  if (errors) {
    formErrors.value = errors;

    showPopover();

    return;
  }

  // Get radius as number
  const radiusStr = formData?.get('radius') as string;
  const radius = radiusStr ?? parseFloat(radiusStr);

  // Perform fetch for properties
  const listingsResult = await $fetch<ListingWithFullProperty[]>('/api/search/listings', {
    method: 'POST',
    body: {
      location: formData?.get('location'),
      radius: radius,
      buyOrRent: formData?.get('buyOrRent'),
      propertyTypes: propertyTypes.map(({ name }) => {
        return formData?.get(name)
      }).filter(Boolean)
    },
  });

  console.log('POST DEBUG', {
    location: formData?.get('location'),
    radius: radius,
    buyOrRent: formData?.get('buyOrRent'),
    propertyTypes: propertyTypes.map(({ name }) => {
      return formData?.get(name)
    }).filter(Boolean)
  })

  searchListings ? searchListings.value = listingsResult : null;
  // Hide popover when search is successful
  hidePopover();
}
</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;
@use '#styles/_utils/media' as mq;

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
  grid-gap: var(--size-8);
  align-items: stretch;
  padding: var(--size-8);

  @include mq.small-tablet {
    padding: var(--size-12);
  }
}

.o-searchform-banner-input {
  outline: none;
  flex: 1 0 max-content;
  padding-inline: var(--size-12);
  text-align: left;
}

.o-searchform-banner:has(.o-searchform-banner-input:focus) {
  outline: var(--focus-outline);
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
  top: calc(100% + var(--size-14));
  left: 50%;
  transform: translateX(-50%);
  padding: var(--size-16);
  width: min(100vw - var(--size-24), 42em);
  text-align: left;
  overflow: hidden;
  margin: 0;

  @include mq.tablet {
    padding: var(--size-32);
    width: min(100vw - var(--size-72), 42em);
  }
}

.o-searchform-autocomplete {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-32);

  @include mq.tablet {
    grid-template-columns: 1.2fr 1fr;
  }
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
  height: 7ch;

  @include mq.small-tablet {
    height: 10ch;
  }

  @include mq.tablet {
    height: auto;
    aspect-ratio: 16 / 9;
  }
}

/**
 *  Open animatinos
 */
@starting-style {
  .o-searchform-popover {
    opacity: 0;
    transform: translateX(-50%) translateY(-1em);
  }
}

.o-searchform-popover {
  display: block;
  transition: opacity var(--animation-fast) ease-out, transform var(--animation-fast) ease-out;
}
</style>
