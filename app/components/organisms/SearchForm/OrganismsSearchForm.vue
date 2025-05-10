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

      <div class="o-searchform-suggestion-hint | title-2xs faded-text" v-else>
        Start typing for location suggestions
      </div>

      <!-- price -->
      <animate-in :delay="50">
        <OrganismsSearchFormTitleBlock title="Price">
          <animate-in :delay="100">
            <LazyMoleculesRangeSlider v-model="selectedPriceRange" :min="priceMin" :max="priceMax"
              :starting-min="priceMin" :starting-max="priceMax" hydrate-on-visible />
          </animate-in>
        </OrganismsSearchFormTitleBlock>
      </animate-in>

      <!-- bedrooms & bathrooms -->
      <animate-in :delay="50">
        <div class="o-searchform-grid">
          <OrganismsSearchFormRooms legend="Bedrooms">
            <animate-in :delay="50">
              <div role="presentation" class="o-searchform-inline-label">
                <span aria-hidden class="| body-sm">Between</span>
                <AtomsSelect v-model="bedroomRange[0]" :options="bedroomOptions"
                  class="| text-input body-sm focus-visible" name="min-bedrooms" aria-label="Minimum bedrooms" />
              </div>
            </animate-in>

            <animate-in :delay="100">
              <div role="presentation" class="o-searchform-inline-label">
                <span aria-hidden class="| body-sm">and</span>
                <AtomsSelect v-model="bedroomRange[1]" :options="bedroomOptions"
                  class="| text-input body-sm focus-visible" name="max-bedrooms" aria-label="Maximum bedrooms" />
              </div>
            </animate-in>
          </OrganismsSearchFormRooms>

          <OrganismsSearchFormRooms legend="Bathrooms">
            <animate-in :delay="150">
              <div role="presentation" class="o-searchform-inline-label">
                <span aria-hidden class="| body-sm">Between</span>
                <AtomsSelect v-model="bathroomRange[0]" :options="bathroomOptions"
                  class="| text-input body-sm focus-visible" name="min-bathrooms" aria-label="Minimum bathrooms" />
              </div>
            </animate-in>

            <animate-in :delay="200">
              <div role="presentation" class="o-searchform-inline-label">
                <span aria-hidden class="| body-sm">and</span>
                <AtomsSelect v-model="bathroomRange[1]" :options="bathroomOptions"
                  class="| text-input body-sm focus-visible" name="max-bathrooms" aria-label="Maximum bathrooms" />
              </div>
            </animate-in>
          </OrganismsSearchFormRooms>
        </div>
      </animate-in>

      <!-- property types -->
      <animate-in :delay="200">
        <OrganismsSearchFormTitleBlock title="Property type">
          <MoleculesScrollBox class="| focus-overflow">
            <ul class="o-searchform-property-types">
              <animate-in v-for="({ id, name, defaultSelected }, index) of propertyTypes" :delay="200 + index * 40">
                <li :key="id">
                  <AtomsToggleBox :label="name" :checked="defaultSelected" type="checkbox" :name />
                </li>
              </animate-in>
            </ul>
          </MoleculesScrollBox>
        </OrganismsSearchFormTitleBlock>
      </animate-in>

      <!-- <template v-if="popoverExpanded"> -->
      <!-- Date Added and Include Options -->
      <div class="o-searchform-grid o-searchform-animation">

        <animate-in :delay="0">
          <OrganismsSearchFormTitleBlock title="Added to site">
            <MoleculesFormField label="Recently Added" class="| focus-overflow">
              <AtomsSelect v-model="initialDate" class="| text-input focus-visible body-sm" name="added-to-site">
                <option v-for="({ key, value }) of dateOptions" :key="value" :value>{{ key
                  }}</option>
              </AtomsSelect>
            </MoleculesFormField>
          </OrganismsSearchFormTitleBlock>
        </animate-in>

        <animate-in :delay="50">
          <OrganismsSearchFormTitleBlock title="Include">
            <MoleculesFormField label="Show" class="| focus-overflow">
              <AtomsSelect class="| text-input focus-visible body-sm" name="include" v-model="initialInclude">
                <option v-for="({ key, value }) of isBuy ? saleAvailabilityOptions : rentAvailabilityOptions"
                  :key="value" :value>{{ key
                  }}</option>
              </AtomsSelect>
            </MoleculesFormField>
          </OrganismsSearchFormTitleBlock>
        </animate-in>
      </div>

      <!-- popular features -->
      <animate-in :delay="100">
        <OrganismsSearchFormTitleBlock title="Popular Features">
          <MoleculesScrollBox class="| focus-overflow">
            <ul class="o-searchform-property-types">
              <animate-in v-for="({ key, label, isDefault }, index) in propertyFeatures" :delay="100 + index * 40">
                <li :key>
                  <AtomsToggleBox :label="label" :checked="isDefault" type="checkbox" :name="key" />
                </li>
              </animate-in>
            </ul>
          </MoleculesScrollBox>
        </OrganismsSearchFormTitleBlock>
      </animate-in>
      <!-- </template> -->

      <!-- Expand popover -->
      <!-- <animate-in :delay="300">
        <div role="presentation">
          <AtomsButton type="button" class="o-searchform-expand | button-bordered button-full"
            @click.prevent="togglePopoverExpanded">
            {{ popoverExpanded ? 'Show fewer options' : 'Show more options' }}
          </AtomsButton>
        </div>
      </animate-in> -->

    </OrganismsSearchFormPopover>
  </form>
</template>

<script setup lang="ts">
import type { PropertyType } from "@prisma/client";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import type { MinMaxPriceResponse } from "~~/shared/types/price";
import OrganismsSearchFormRooms from "./OrganismsSearchFormRooms.vue";

/**
 *  Get search form config
 */
const {
  radiusOptions,
  bedroomOptions,
  bathroomOptions,
  dateOptions,
  saleAvailabilityOptions,
  rentAvailabilityOptions,
  propertyFeatures,
  buyOrRentOptions
} = getSearchFormConfig()

/**
 *  Popover management
 */
const $form = useTemplateRef("$form");

/**
 *  Popover expanded
 */
const popoverExpanded = ref(false)

function togglePopoverExpanded() {
  popoverExpanded.value = !popoverExpanded.value
}

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
 *  Buy or rent
 */
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
  } else if (buyOrRent.value === 'buy') {
    includeOptions.value = saleAvailabilityOptions;
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
  width: fit-content;
  margin-inline: auto;
}

.o-searchform-banner {
  display: flex;
  grid-gap: var(--size-8);
  align-items: stretch;
  padding: var(--size-8);
  border-radius: var(--border-radius-xl);

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
}

.o-searchform-popover {
  --popover-radius: var(--border-radius-xl);
  --popover-padding: var(--size-20);

  width: min(100vw - var(--size-24), 42em);
  text-align: left;
  overflow: hidden;
  margin: 0;
  position: absolute;
  top: calc(100% + var(--size-14));
  left: 50%;
  transform: translateX(-50%);
  width: min(100vw - var(--size-24), 42em);
  text-align: left;
  overflow: hidden;
  padding: var(--popover-padding);
  border-radius: var(--popover-radius);

  @include mq.small-tablet {
    --popover-radius: var(--size-28);
    --popover-padding: var(--border-radius-2xl);
  }

  @include mq.tablet {
    --popover-radius: var(--size-32);
    --popover-padding: var(--border-radius-3xl);

    width: min(100vw - var(--size-72), 42em);
  }

  @include mq.notebook {
    --popover-radius: var(--size-40);

    width: min(100vw - var(--size-72), 42em);
  }

  @include mq.notebook {
    --popover-radius: var(--size-40);

    width: min(100vw - var(--size-72), 42em);
  }
}

.o-searchform-suggestion-hint {
  background: var(--background-100);
  padding: var(--popover-padding);
  border-radius: var(--border-radius-lg);
  text-align: center;

  @include mq.small-tablet {
    border-radius: var(--border-radius-xl);
  }

  @include mq.tablet {
    border-radius: var(--border-radius-2xl);
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

.o-searchform-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--size-20);

  @include mq.tablet {
    grid-template-columns: repeat(2, 1fr);

    gap: var(--size-48);
  }
}

.o-searchform-inline-label {
  display: flex;
  align-items: center;
  gap: var(--size-12);
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

.o-searchform-expand {
  padding: var(--size-12);
  border-radius: var(--border-radius-ui);
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
