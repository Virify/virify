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

    <OrganismsSearchFormPopover class="o-searchform-popover o-searchform-animation | container container-md elevate-300"
      :hidden="popoverHidden">
      <MoleculesErrorBox v-if="formErrors" :error="formErrors" />

      <div v-if="suggestions" class="o-searchform-autocomplete o-searchform-animation">
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
            <AtomsSelect :id :options="radiusOptions" v-model="initialRadius" class="| text-input body-sm focus-visible"
              name="radius" />
          </MoleculesFormField>
          <!-- <div class="o-searchform-map | title-2xl">Map</div> -->
        </div>

      </div>

      <!-- property types -->
      <OrganismsSearchFormTitleBlock title="Property type" class="| animate-fade-down" style="--delay: 50ms">
        <MoleculesScrollBox class="| focus-overflow">
          <ul class="o-searchform-property-types">
            <li v-for="({ id, name, defaultSelected }, index) of propertyTypes" :key="id" class="| animate-fade-down"
              :style="`--delay: ${50 + index * 40}ms`">
              <AtomsToggleBox :label="name" :checked="defaultSelected" type="checkbox" :name />
            </li>
          </ul>
        </MoleculesScrollBox>
      </OrganismsSearchFormTitleBlock>


      <!-- bedrooms & bathrooms -->
      <div class="o-searchform-filter o-searchform-animation">
        <OrganismsSearchFormTitleBlock title="Bedrooms" class="| animate-fade-down" style="--delay: 50ms">
          <div class="o-searchform-filter">
            <MoleculesFormField label="Min" class="| focus-overflow" v-slot="{ id }">
              <AtomsSelect v-model="bedroomRange[0]" :id class="| text-input body-sm focus-visible" name="min-bedrooms">
                <option v-for="({ key, value }) of bedroomOptions" :key="value" :value>{{
                  key }}</option>
              </AtomsSelect>
            </MoleculesFormField>
            <MoleculesFormField label="Max" class="| focus-overflow" v-slot="{ id }">
              <AtomsSelect v-model="bedroomRange[1]" :id class="| text-input body-sm focus-visible" name="max-bedrooms">
                <option v-for="({ key, value }) of bedroomOptions" :key="value" :value>{{
                  key }}</option>
              </AtomsSelect>
            </MoleculesFormField>
          </div>
        </OrganismsSearchFormTitleBlock>

        <OrganismsSearchFormTitleBlock title="Bathrooms" class="| animate-fade-down" style="--delay: 50ms">
          <div class="o-searchform-filter">
            <MoleculesFormField label="Min" class="| focus-overflow" v-slot="{ id }">
              <AtomsSelect v-model="bathroomRange[0]" :id class="| text-input body-sm focus-visible"
                name="min-bathrooms">
                <option v-for="({ key, value }) of bathroomOptions" :key="value">
                  {{ key }}</option>
              </AtomsSelect>
            </MoleculesFormField>
            <MoleculesFormField label="Max" class="| focus-overflow" v-slot="{ id }">
              <AtomsSelect v-model="bathroomRange[1]" :id class="| text-input body-sm focus-visible"
                name="max-bathrooms">
                <option v-for="({ key, value }) of bathroomOptions" :key="value">
                  {{ key }}</option>
              </AtomsSelect>
            </MoleculesFormField>
          </div>
        </OrganismsSearchFormTitleBlock>
      </div>

      <!-- price -->
      <OrganismsSearchFormTitleBlock title="Price" class="| animate-fade-down" style="--delay: 150ms">
        <LazyMoleculesRangeSlider v-model="selectedPriceRange" :min="priceMin" :max="priceMax" :starting-min="priceMin"
          :starting-max="priceMax" hydrate-on-visible class="| animate-fade-down" style="--delay: 200ms" />
      </OrganismsSearchFormTitleBlock>


      <!-- Date Added and Include Options -->
      <div class="o-searchform-filter o-searchform-animation">
        <OrganismsSearchFormTitleBlock title="Added to site" class="| animate-fade-down" style="--delay: 50ms">
          <MoleculesFormField label="Recently Added" class="| focus-overflow">
            <AtomsSelect v-model="initialDate" class="| text-input focus-visible body-sm" name="added-to-site">
              <option v-for="({ key, value }) of dateOptions" :key="value" :value>{{ key
              }}</option>
            </AtomsSelect>
          </MoleculesFormField>
        </OrganismsSearchFormTitleBlock>

        <OrganismsSearchFormTitleBlock title="Include" class="| animate-fade-down" style="--delay: 50ms">
          <MoleculesFormField label="Show" class="| focus-overflow">
            <AtomsSelect class="| text-input focus-visible body-sm" name="include" v-model="initialInclude">
              <option v-for="({ key, value }) of isBuy ? saleAvailabilityOptions : rentAvailabilityOptions" :key="value"
                :value>{{ key
                }}</option>
            </AtomsSelect>
          </MoleculesFormField>
        </OrganismsSearchFormTitleBlock>
      </div>

      <!-- popular features -->
      <OrganismsSearchFormTitleBlock title="Popular Features" class="| animate-fade-down" style="--delay: 250ms">
        <MoleculesScrollBox class="| focus-overflow">
          <ul class="o-searchform-property-types">
            <li v-for="({ key, label, isDefault }, index) in propertyFeatures" :key="key" class="| animate-fade-down"
              :style="`--delay: ${250 + index * 40}ms`">
              <AtomsToggleBox :label="label" :checked="isDefault" type="checkbox" :name="key" />
            </li>
          </ul>
        </MoleculesScrollBox>
      </OrganismsSearchFormTitleBlock>

    </OrganismsSearchFormPopover>

  </form>
</template>

<script setup lang="ts">
import type { PropertyType } from "@prisma/client";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import type { MinMaxPriceResponse } from "~~/shared/types/price";

/**
 *  Popover management
 */
const $form = useTemplateRef("$form");

/**
 * state
 */
const popoverHidden = ref(true);
const suggestions = ref("");
const bedroomRange = ref<[number, number]>([0, 0])
const bathroomRange = ref<[number, number]>([0, 0])
const initialRadius = computed(() => radiusOptions?.[0]?.value)
const initialDate = computed(() => dateOptions?.[0]?.value)
const buyOrRent = ref("buy");
const includeOptions = ref<{ value: string; key: string; }[]>([]);
const initialInclude = computed(() => includeOptions.value?.[0]?.value)

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
    $form.value.setAttribute("novalidate", "novalidate");
  }
  priceRange.value = await $fetch<MinMaxPriceResponse>("/api/price/min-max");
});

/**
 *  Search typed
 */

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
 * Bedrooms
 */

const bedroomOptions = [
  { value: "0", key: "Any" },
  { value: "1", key: "1" },
  { value: "2", key: "2" },
  { value: "3", key: "3" },
  { value: "4", key: "4" },
  { value: "5", key: "5" },
  { value: "6", key: "6" },
  { value: "7", key: "7" },
  { value: "8", key: "8" },
  { value: "9", key: "9" },
  { value: "10", key: "10" },
];

/**
 * Date Options
 */
const dateOptions = [
  { value: "0", key: "Anytime" },
  { value: "1", key: "1 day" },
  { value: "3", key: "3 days" },
  { value: "7", key: "7 days" },
  { value: "14", key: "14 days" },
];

/**
 * Bathroom options
 */

const bathroomOptions = [
  { value: "0", key: "Any" },
  { value: "1", key: "1" },
  { value: "2", key: "2" },
  { value: "3", key: "3" },
  { value: "4", key: "4" },
  { value: "5", key: "5" },
];

/**
 * Include Options
 * 
 * !! These are very specific enums from the database
 */
const saleAvailabilityOptions = [
  { value: "all", key: "All" },
  { value: "available", key: "Available" },
  { value: "under offer", key: "Under offer" },
  { value: "sold", key: "Sold" },
]

const rentAvailabilityOptions = [
  { value: "all", key: "All" },
  { value: "available", key: "Available" },
  { value: "let agreed", key: "Let agreed" },
  { value: "let", key: "Let" },
]

/**
 * Propety Feature options
 * 
 * !! refer to the property schema for correct group fields
 */
const propertyFeatures = [
  { group: 'additionalFeatures', key: "petFriendly", label: "Pet-friendly", isDefault: true },
  { group: 'parking', key: "garage", label: "Garage", isDefault: false },
  { group: 'parking', key: "evCharging", label: "EV Charging", isDefault: false },
  { group: 'outdoorSpace', key: "garden", label: "Garden", isDefault: false },
  { group: 'accessibilityFeatures', key: "wheelchairFriendly", label: "Accessible", isDefault: false },
];

/**
 *  Buy or rent
 */
const buyOrRentOptions = [
  { key: "buy", value: "Buy" },
  { key: "rent", value: "Rent" },
  // { key: 'price', value: 'Prices' },
];

const isBuy = computed(() => buyOrRent.value === "buy" ? true : false);

/**
 *  Property type
 */
const propertyTypes = await $fetch<PropertyType[]>("/api/property-type/all");

/**
 * Auto Complete
 */
const suggestionsMatches = ref<string[]>([]);

watchDebounced(
  () => suggestions.value.toLowerCase(),
  async (suggestionsLower) => {
    if (suggestionsLower) {
      const result = await $fetch<string[]>("/api/address/auto-complete", {
        query: { location: suggestionsLower },
      });
      suggestionsMatches.value = result;
    } else {
      suggestionsMatches.value = [];
    }
  },
  { debounce: 150 }
);

/**
 * Price range
 */
const priceRange = ref<MinMaxPriceResponse>({
  rental: [0, 0],
  sale: [0, 0],
});

const priceMin = computed(() => (buyOrRent.value === "rent" ? priceRange.value.rental[0] : priceRange.value.sale[0]));
const priceMax = computed(() => (buyOrRent.value === "rent" ? priceRange.value.rental[1] : priceRange.value.sale[1]));

const selectedPriceRange = ref<[number, number]>([priceMin.value, priceMax.value]);

/**
 *  Watchers
 */

watch(buyOrRent, () => {
  if (buyOrRent.value === 'rent') {
    includeOptions.value = rentAvailabilityOptions;
    console.log(includeOptions.value);
  } else if (buyOrRent.value === 'buy') {
    includeOptions.value = saleAvailabilityOptions;
    console.log(includeOptions.value);
  }
}, { immediate: true });

/**
 *  Submit form
 */
const formErrors = ref();

watch(suggestions, (newValue) => {
  if (!formErrors.value || !newValue) return;

  formErrors.value = null;
});

const searchListings = inject<Ref<ListingCardType[] | null>>("searchListings");


async function sendForm(event: Event) {
  const target = event.target as HTMLFormElement;
  const { formData, errors } = useFormData(target);
  // format features to post
  const formatFeatures = propertyFeatures.map(({ key, group }) => {
    const keyValue = formData?.get(key);
    if (keyValue) {
      return {
        group,
        key
      };
    }
    return null;
  }).filter(Boolean);

  // format propertyTypes to post
  const formatPropertyTypes = propertyTypes.map(({ name }) => {
    return formData?.get(name);
  }).filter(Boolean);

  // If any errors exist, terminate and display
  if (errors) {
    formErrors.value = errors;

    showPopover();

    return;
  }

  // Get radius as number
  const radiusStr = formData?.get("radius") as string;
  const radius = radiusStr ?? parseFloat(radiusStr);

  function normalizeRange(range: [number, number]): [number, number] {
    const [min, max] = range;
    return min > max ? [max, min] : [min, max];
  }

  bedroomRange.value = normalizeRange(bedroomRange.value);
  bathroomRange.value = normalizeRange(bathroomRange.value);

  // Perform fetch for properties
  const searchResult = await $fetch<ListingCardType[]>("/api/search/listings", {
    method: "POST",
    body: {
      location: formData?.get("location"),
      radius: radius,
      buyOrRent: formData?.get("buyOrRent"),
      propertyTypes: formatPropertyTypes,
      priceRange: selectedPriceRange.value,
      bedrooms: bedroomRange.value,
      bathrooms: bathroomRange.value,
      addedToSite: formData?.get('added-to-site'),
      availabilityOptions: formData?.get('include'),
      featured: formatFeatures
    }
  });
  console.log("POST DEBUG", {
    location: formData?.get("location"),
    radius: radius,
    buyOrRent: formData?.get("buyOrRent"),
    propertyTypes: formatPropertyTypes,
    priceRange: selectedPriceRange.value,
    bedrooms: bedroomRange.value,
    bathrooms: bathroomRange.value,
    addedToSite: formData?.get('added-to-site'),
    availabilityOptions: formData?.get('include'),
    featured: formatFeatures
  });

  if (searchListings) {
    searchListings.value = searchResult;
  }
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

.o-searchform-filter {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-16);

  @include mq.tablet {
    grid-template-columns: 1fr 1fr;
  }
}

.o-searchform-toggle {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 34px;
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
  // Allows some vertical overflow for animations
  padding: 1em 0 0;
  margin: -1em 0 0;
  // End animation vertical overflow
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
.o-searchform-animation {
  interpolate-size: allow-keywords;

  transition-duration: var(--animation-veryslow);
  transition-timing-function: var(--ease-out);
  transition-delay: var(--delay, 0ms);
  overflow-y: clip;
  height: calc-height(max-content, size);
}

.o-searchform-popover {
  transition-property: opacity, transform;
}

.o-searchform-autocomplete {
  transition-property: height;
}

@starting-style {
  .o-searchform-popover {
    height: 0;
    opacity: 0;
    transform: translateX(-50%) translateY(-2em);
  }

  .o-searchform-autocomplete {
    height: 0;
  }
}
</style>
