<template>
  <form class="o-searchform | flow flow-sm relative" ref="$form" @keydown.escape="hidePopover" @submit.prevent="sendForm">
    <MoleculesSwitcher class="o-searchform-buyrent" legend="Buy or rent" :options="buyOrRentOptions" v-model="buyOrRent" name="buyOrRent" />

    <div class="o-searchform-banner">
      <input type="search" placeholder="Location" aria-label="Location to search in" class="o-searchform-banner-input" required @click="showPopover" @focus="showPopover" @input="showPopover" v-model="suggestions" name="location" />

      <select class="o-searchform-banner-select | focus-visible" aria-label="Radius of search" name="radius">
        <option v-for="{ key, value } of radiusOptions" :key="value" :value="value">{{ key }}</option>
      </select>

      <div class="o-searchform-banner-button-wrapper">
        <button type="submit" class="o-searchform-banner-button | button button-monochrome">
          <AtomsIcon title="Search" icon="search" class="o-searchform-banner-button-icon" />
        </button>
      </div>
    </div>

    <OrganismsSearchFormPopover class="o-searchform-popover | container container-md elevate-300" :hidden="popoverHidden">
      <MoleculesErrorBox v-if="formErrors" :error="formErrors" />

      <OrganismsSearchFormTitleBlock v-if="suggestions" class="o-searchform-autocomplete">
        <div role="presentation">
          <h2 class="| title-sm">Locations</h2>

          <MoleculesAutocomplete :input="suggestions" :matches="suggestionsMatches" v-slot="{ original, current, suggestion }">
            <button class="o-searchform-autocomplete-button | body-md" @click.prevent="setSelectedSuggestion(original)">
              <strong class="o-searchform-autocomplete-button-highlight">{{ current }}</strong
              >{{ suggestion }}
            </button>
          </MoleculesAutocomplete>
        </div>

        <div class="o-searchform-map | title-2xl">Map</div>
      </OrganismsSearchFormTitleBlock>

      <OrganismsSearchFormTitleBlock title="Property type">
        <MoleculesScrollBox class="| focus-overflow">
          <ul class="o-searchform-property-types">
            <li v-for="label of propertType">
              <AtomsToggleBox :label type="checkbox" :name="label" v-model="selectedPropertyType[label]" />
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
import { onClickOutside } from "@vueuse/core";
import type { ErrorBoxProp } from "~/types/error-box";

/**
 *  Popover management
 */
const $form = useTemplateRef("$form");
const searchListings = inject<Ref<ListingWithFullProperty[] | null>>("searchListings");

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
onMounted(() => {
  if ($form.value) {
    $form.value.setAttribute("novalidate", true.toString());
  }
});

/**
 *  Search typed
 */
const suggestions = ref("");

function setSelectedSuggestion(newValue: string) {
  suggestions.value = newValue;
}

/**
 *  Search radius
 */
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

/**
 *  Buy or rent
 */
const buyOrRent = ref("buy");

const buyOrRentOptions = [
  { key: "buy", value: "Buy" },
  { key: "rent", value: "Rent" },
  { key: "price", value: "Prices" },
];

/**
 *  Property type
 */
const propertType = ["Detached", "Semi-detached", "Terraced", "End-terrace", "Flat", "Cottage", "Bungalow"];

const selectedPropertyType = reactive<Record<string, boolean>>({
  Detached: true,
  "Semi-detached": true,
  Terraced: true,
  "End-terrace": true,
});

/**
 *  Mock autocomplete
 */
const suggestionsMatches = computed(() => {
  // Avoid case sensitivity
  const suggestionsLower = suggestions.value.toLowerCase();

  // Mock filter
  return [
    "Stevenage, Hertfordshire",
    "Steventon, Oxford",
    "St. Albans, Hertforshire",
    "St. Neots, Hertfordshire",
    "Stoke-on-Trent, Staffordshire",
    "Stepps, Glasgow",
    "Stepney, London",
    "Stockwell, London",
    "Stratford, London",
    "South London",
    "South West London",
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
const formErrors = ref<ErrorBoxProp | null>(null);

watch(suggestions, (newValue) => {
  if (!formErrors.value || !newValue) return;

  formErrors.value = null;
});

async function sendForm({ target }: { target: HTMLFormElement }) {
  const { formData, errors } = useFormData(target);
  // radius as number
  const radiusStr = formData ? formData.get("radius") : null;
  const radius = radiusStr !== null ? parseFloat(radiusStr as string) : null;
  if (errors) {
    formErrors.value = errors;
    showPopover();
    return;
  }

  const listingsResult = await $fetch<ListingWithFullProperty[]>("/api/search/listings", {
    method: "POST",
    body: {
      location: formData ? formData.get("location") : null,
      radius: radius,
      buyOrRent: formData ? formData.get("buyOrRent") : null,
    },
  });

  searchListings ? searchListings.value = listingsResult : null;
  // Hide popover when search is successful
  hidePopover();
}
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

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
  display: grid;
  grid-template-columns: 1fr auto;
  grid-column-gap: var(--size-12);
  align-items: stretch;
  padding: var(--size-12);

  @include mq.small-tablet {
    display: flex;
    grid-template-columns: unset;
    grid-column-gap: unset;
    flex-direction: row;
    padding: 0;
  }
}

.o-searchform-banner-input,
.o-searchform-banner-select {
  width: auto;
  min-width: 0;
}

.o-searchform-banner-input {
  outline: none;
  grid-column: span 2;
  height: var(--size-56);
  flex: 1 0 min-content;
  padding-inline: var(--size-12);
  text-align: center;

  @include mq.small-tablet {
    grid-column: unset;
    height: unset;
    padding-inline-start: var(--size-32);
    text-align: left;
  }
}

.o-searchform-banner:has(.o-searchform-banner-input:focus) {
  outline: var(--focus-outline);
}

.o-searchform-banner-select {
  height: var(--size-56);
  border-radius: var(--border-radius-ui);
  padding-inline: var(--size-12);
  margin: auto 0;
  cursor: pointer;

  &:hover {
    background: fn.faded-color(12%);
  }
}

.o-searchform-banner-button-wrapper {
  @include mq.small-tablet {
    padding: var(--size-12);
  }
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
    transform: translateX(-50%) translateY(-1em);
  }
}

.o-searchform-popover {
  display: block;
  transition: opacity var(--animation-fast) ease-out, transform var(--animation-fast) ease-out;
}
</style>
