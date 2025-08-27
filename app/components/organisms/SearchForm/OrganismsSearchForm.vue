<template>
  <div class="o-searchform-fixed" :class="{
    'o-searchform-fixed-contracted': isContracted
  }" data-allow-mismatch="class">
    <Teleport to="#teleports">
      <button v-if="!popoverHidden" class="o-searchform-backdrop" aria-label="Hide search form"
        :aria-controls="popoverId" aria-expanded="true"></button>
    </Teleport>

    <form ref="$form" autocomplete="off" class="o-searchform" :class="{
      'o-searchform-expanded': !popoverHidden,
      'o-searchform-contracted': isContracted
    }" @keydown.escape="hidePopover" @submit.prevent="sendForm" data-allow-mismatch="class">
      <Transition name="buyrent">
        <MoleculesSwitcher v-show="!isContracted" class="o-searchform-buyrent" legend="Buy or rent"
          :options="buyOrRentOptions" v-model="buyOrRent" name="buyOrRent" />
      </Transition>

      <div class="| relative" role="presentation">
        <div class="o-searchform-location | elevate-200" @click="showPopover">
          <input type="search" :placeholder="isDrawMode ? `Draw on the map` : `Location`" aria-label="Location to search in"
            class="o-searchform-location-input" required @focus="showPopover" @input="showPopover"
            v-model="suggestions.location" name="location" :disabled="isDrawMode" />

          <!-- Search radius (desktop) -->
          <client-only>
            <AtomsSelect aria-label="Search radius" v-if="isTablet && !popoverHidden" :options="radiusOptions"
              v-model="initialRadius"
              class="o-searchform-location-radius o-searchform-dropdown | text-input focus-visible" name="radius" />
          </client-only>

          <!-- Draw mode toggle -->
          <AtomsButton
            v-show="popoverHidden && mapDraw"
            type="button" 
            class="o-searchform-draw-button" 
            :class="{ 'o-searchform-draw-button-active': isDrawMode }"
            @click.stop="toggleDrawMode">
            <AtomsIcon title="Draw on map" icon="draw" class="o-searchform-draw-button-icon" />
          </AtomsButton>

          <AtomsButton type="submit" :pending="isPending" class="o-searchform-location-button | button-monochrome"
            :class="{
              '| pointer-none': isContracted,
              '| pulse': isContracted && !isPending,
            }" data-allow-mismatch="class">
            <AtomsIcon title="Search" icon="search" class="o-searchform-location-button-icon" />
          </AtomsButton>
        </div>

        <div :id="popoverId" role="presentation" class="o-searchform-popover" :hidden="popoverHidden">
          <MoleculesErrorBox v-if="formErrors" :error="formErrors" />

          <!-- Location -->
          <OrganismsSearchFormDividedRows v-if="suggestions">
            <OrganismsSearchFormTitleBlock title="Location">
              <MoleculesAutocomplete :input="suggestions.location" :matches="suggestionsMatches"
                v-slot="{ original, current, suggestion }">
                <button class="o-searchform-autocomplete-button | body-md"
                  @click.prevent="setSelectedSuggestion(original)">
                  <strong class="o-searchform-autocomplete-button-highlight">{{ current }}</strong>{{ suggestion }}
                </button>
              </MoleculesAutocomplete>
            </OrganismsSearchFormTitleBlock>
          </OrganismsSearchFormDividedRows>

          <!-- Search readius -->
          <client-only>
            <OrganismsSearchFormDividedRows v-if="!isTablet">
              <MoleculesFormField label="Search radius" v-slot="{ id }">
                <AtomsSelect :id :options="radiusOptions" v-model="initialRadius"
                  class="o-searchform-dropdown | text-input focus-visible" name="radius" />
              </MoleculesFormField>
            </OrganismsSearchFormDividedRows>
          </client-only>

          <!-- price -->
          <animate-in :delay="50">
            <OrganismsSearchFormDividedRows>
              <OrganismsSearchFormTitleBlock title="Price">
                <animate-in :delay="75">
                  <LazyMoleculesRangeSlider v-model="selectedPriceRange" :min="priceMin" :max="priceMax"
                    :starting-min="priceMin" :starting-max="priceMax" :graph-data="priceRangeGraph"
                    hydrate-on-visible />
                </animate-in>
              </OrganismsSearchFormTitleBlock>
            </OrganismsSearchFormDividedRows>
          </animate-in>

          <!-- bedrooms & bathrooms -->
          <animate-in :delay="75">
            <OrganismsSearchFormDividedRows>
              <OrganismsSearchFormDividedColumns>
                <template #left-column>
                  <OrganismsSearchFormTitleBlock title="Bedrooms">
                    <OrganismsSearchFormGrid grid-auto>
                      <animate-in :delay="75">
                        <OrganismsSearchFormFlex>
                          <span aria-hidden class="| body-sm">Between</span>
                          <AtomsSelect v-model="bedroomRange[0]" :options="bedroomOptions"
                            class="o-searchform-dropdown | text-input focus-visible" name="min-bedrooms"
                            aria-label="Minimum bedrooms" />
                        </OrganismsSearchFormFlex>
                      </animate-in>

                      <animate-in :delay="100">
                        <OrganismsSearchFormFlex>
                          <span aria-hidden class="| body-sm">and</span>
                          <AtomsSelect v-model="bedroomRange[1]" :options="bedroomOptions"
                            class="o-searchform-dropdown | text-input focus-visible" name="max-bedrooms"
                            aria-label="Maximum bedrooms" />
                        </OrganismsSearchFormFlex>
                      </animate-in>
                    </OrganismsSearchFormGrid>
                  </OrganismsSearchFormTitleBlock>
                </template>

                <template #right-column>
                  <OrganismsSearchFormTitleBlock title="Bathrooms">
                    <OrganismsSearchFormGrid grid-auto>
                      <animate-in :delay="125">
                        <OrganismsSearchFormFlex>
                          <span aria-hidden class="| body-sm">Between</span>
                          <AtomsSelect v-model="bathroomRange[0]" :options="bathroomOptions"
                            class="o-searchform-dropdown | text-input focus-visible" name="min-bathrooms"
                            aria-label="Minimum bathrooms" />
                        </OrganismsSearchFormFlex>
                      </animate-in>

                      <animate-in :delay="150">
                        <OrganismsSearchFormFlex>
                          <span aria-hidden class="| body-sm">and</span>
                          <AtomsSelect v-model="bathroomRange[1]" :options="bathroomOptions"
                            class="o-searchform-dropdown | text-input focus-visible" name="max-bathrooms"
                            aria-label="Maximum bathrooms" />
                        </OrganismsSearchFormFlex>
                      </animate-in>
                    </OrganismsSearchFormGrid>
                  </OrganismsSearchFormTitleBlock>
                </template>
              </OrganismsSearchFormDividedColumns>
            </OrganismsSearchFormDividedRows>
          </animate-in>

          <!-- property types -->
          <animate-in :delay="150">
            <OrganismsSearchFormDividedRows :hide-divider="!popoverExpanded">
              <OrganismsSearchFormTitleBlock title="Property type">
                <div role="presentation" class="| flow flow-xs">
                  <MoleculesAccordionMultiselect v-for="{ id, name, options } of propertyTypes" :title="name" :options
                    v-model="selectedPropertyTypes[id]" />
                </div>
              </OrganismsSearchFormTitleBlock>
            </OrganismsSearchFormDividedRows>
          </animate-in>

          <!-- Date Added and Include Options -->
          <OrganismsSearchFormDividedRows v-show="popoverExpanded">
            <OrganismsSearchFormDividedColumns class="o-searchform-animation">
              <template #left-column>
                <animate-in :delay="0">
                  <MoleculesFormField label="Added to site" class="| focus-overflow">
                    <AtomsSelect v-model="initialDate" class="o-searchform-dropdown | text-input focus-visible"
                      name="added-to-site">
                      <option v-for="({ key, value }) of dateOptions" :key="value" :value>{{ key
                        }}</option>
                    </AtomsSelect>
                  </MoleculesFormField>
                </animate-in>
              </template>

              <template #right-column>
                <animate-in :delay="25">
                  <MoleculesFormField label="Property availability" class="| focus-overflow">
                    <AtomsSelect class="o-searchform-dropdown | text-input focus-visible" name="include"
                      v-model="initialInclude">
                      <option v-for="({ key, value }) of isBuy ? saleAvailabilityOptions : rentAvailabilityOptions"
                        :key="value" :value>{{ key
                        }}</option>
                    </AtomsSelect>
                  </MoleculesFormField>
                </animate-in>
              </template>
            </OrganismsSearchFormDividedColumns>
          </OrganismsSearchFormDividedRows>

          <!-- popular features -->
          <animate-in :delay="50">
            <OrganismsSearchFormDividedRows hide-divider v-show="popoverExpanded">
              <OrganismsSearchFormTitleBlock title="Popular Features">
                <MoleculesScrollBox class="| focus-overflow">
                  <ul class="o-searchform-toggles">
                    <animate-in v-for="({ key, label, isDefault }, index) in propertyFeatures" :delay="50 + index * 30">
                      <li :key>
                        <AtomsToggleBox :label="label" :checked="isDefault" type="checkbox" :name="key" />
                      </li>
                    </animate-in>
                  </ul>
                </MoleculesScrollBox>
              </OrganismsSearchFormTitleBlock>
            </OrganismsSearchFormDividedRows>
          </animate-in>

          <!-- Expand popover -->
          <animate-in :delay="200">
            <div role="presentation">
              <AtomsButton type="button" class="o-searchform-expand | button-bordered button-full"
                @click.prevent="togglePopoverExpanded">
                {{ popoverExpanded ? 'Show fewer options' : 'Show more options' }}
              </AtomsButton>
            </div>
          </animate-in>

          <animate-in :delay="150">
            <OrganismsSearchFormFooter />
          </animate-in>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, watchDebounced, watchImmediate, useMediaQuery } from "@vueuse/core";
import type { MinMaxPriceResponse } from "~~/shared/types/price";
import type { PropertyTypeWithOptions } from "~~/shared/types/property-type";
import type { SearchParams } from "~~/shared/types/search";

/**
 * Props
 */
defineProps({
  mapDraw: {
    type: Boolean,
    default: false
  }
})
/**
 *  a11y
 */
const popoverId = useId()

/**
 *  Whether to show the radius dropdown inline or below
 */
const isTablet = useMediaQuery('(min-width: 768px)', {
  ssrWidth: 1024
})

/**
 *  Determine whether to shrink the search form
 */
const isScrolled = ref(false)

useScrollThreshold(10, (newValue) => {
  isScrolled.value = newValue
})

const isContracted = computed(() => {
  // Only contract when scrolling, not on initial page load
  return isScrolled.value && popoverHidden.value
})

/**
 *  Get search form config
 */
const { radiusOptions, bedroomOptions, bathroomOptions, dateOptions, saleAvailabilityOptions, rentAvailabilityOptions, propertyFeatures, buyOrRentOptions } = getSearchFormConfig();
const { autoComplete, getBBox } = useMap();

/**
 *  Popover management
 */
const $form = useTemplateRef("$form");

/**
 *  Popover expanded
 */
const popoverExpanded = ref(false);

function togglePopoverExpanded() {
  popoverExpanded.value = !popoverExpanded.value;
}

/**
 * state
 */
const popoverHidden = ref(true);
const suggestions = ref({
  location: "",
  geo: {
    lat: 0,
    lon: 0,
  },
});

/**
 * State
 */
const isDrawMode = ref(false);
const bedroomRange = ref<[number, number]>([0, 0]);
const bathroomRange = ref<[number, number]>([0, 0]);
const initialRadius = ref(radiusOptions?.[0]?.value);
const initialDate = ref(dateOptions?.[0]?.value);
const buyOrRent = ref("buy");
const includeOptions = ref<{ value: string; key: string }[]>([]);
const initialInclude = ref(includeOptions.value?.[0]?.value);
const searchParams = useState<SearchParams>("searchParams");

// Show/hide form if appropriate
function togglePopoverHidden(setHidden = false) {
  if (popoverHidden.value === setHidden) return;

  useViewTransition(() => {
    popoverHidden.value = setHidden;
  })
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
 * Emits
 */
const emit = defineEmits<{
 'update:drawMode': [enabled: boolean];
}>();

const toggleDrawMode = () => {
  isDrawMode.value = !isDrawMode.value;
  suggestions.value.location = "";
  emit("update:drawMode", isDrawMode.value);
};



/**
 *  Block native form validation on mount
 */
onMounted(async () => {
  if ($form.value) {
    $form.value.setAttribute("novalidate", "novalidate");
  }
  priceRange.value = await $fetch<MinMaxPriceResponse>("/api/price/min-max/");
});

/**
 *  Search typed
 */

// Store geocoded results to use when selecting a suggestion
const geocodedResults = ref<any[]>([]);

async function setSelectedSuggestion(newValue: string) {
  suppressSuggestionFetch.value = true
  suggestions.value.location = newValue;

  // Find the selected suggestion in our cached geocoded results
  const selecedLocation = geocodedResults.value.find(item => item.place_name_en === newValue);
  if (selecedLocation) {
    suggestions.value.geo.lat = selecedLocation.center[1];
    suggestions.value.geo.lon = selecedLocation.center[0];
    console.log("Selected coordinates:", suggestions.value.geo);
  }
}

/**
 *  Buy or rent
 */
const isBuy = computed(() => (buyOrRent.value === "buy" ? true : false));

/**
 *  Property type
 */
const propertyTypes = await $fetch<PropertyTypeWithOptions[]>("/api/property-type/");
const selectedPropertyTypes = reactive<Record<string, string[]>>({});

/**
 * Auto Complete
 */
const suggestionsMatches = ref<string[]>([]);
const suppressSuggestionFetch = ref(false)

watchDebounced(
  () => suggestions.value.location.toLowerCase(),
  async (suggestionsLower) => {
    // stop request when selecting a suggestion
    if (suppressSuggestionFetch.value) {
      suppressSuggestionFetch.value = false
      return
    }
    // lower debounce for postcodes
    if (suggestionsLower && suggestionsLower.length > 2) {
      const result = await autoComplete(suggestionsLower);
      // Store the full geocoded results for later use
      geocodedResults.value = result;
      suggestionsMatches.value = result.map((item) => {
        return item.place_name_en;
      });
    } else {
      suggestionsMatches.value = [];
    }
  },
  { debounce: 300 }
);

/**
 * Price range
 */
const { data: priceRangeGraph } = useAsyncData('price-graph', () => {
  return $fetch<string[]>("/api/price/graph/", {
    params: {
      listingType: buyOrRent.value
    }
  })
}, {
  watch: [buyOrRent]
})

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

watchImmediate(buyOrRent, () => {
  if (buyOrRent.value === "rent") {
    includeOptions.value = rentAvailabilityOptions;
    initialInclude.value = rentAvailabilityOptions[0]?.value;
  } else if (buyOrRent.value === "buy") {
    includeOptions.value = saleAvailabilityOptions;
    initialInclude.value = rentAvailabilityOptions[0]?.value;
  }
});

/**
 *  Pending states
 */
const { isPending, setPendingWhile } = usePending();

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

  /**
   * formatted data to build the search
   */
  const { formData, errors } = useFormData(target);
  const formattedFeatures = formatFeatures(propertyFeatures, formData);
  bedroomRange.value = normalizeRange(bedroomRange.value);
  bathroomRange.value = normalizeRange(bathroomRange.value);
  const { radius, location, buyOrRent } = extractFormData(formData, ["radius", "location", "buyOrRent"]);

  // If any errors exist, terminate and display
  if (errors) {
    formErrors.value = errors;
    showPopover();
    return;
  }

  /**
   * Check for polygon geometry from map drawing
   */
  const polygonGeometries = getBBox();

  /**
   * Save search params to state
   */
  searchParams.value = {
    location: suggestions.value.location, // Use the display name for location
    // Use polygon geometries if available, otherwise use coordinates and radius
    ...(polygonGeometries && polygonGeometries.length > 0
      ? { geometries: polygonGeometries.map(g => ({ type: g.type, coordinates: g.coordinates })) }
      : {
          coordinates: {
            lat: suggestions.value.geo.lat,
            lon: suggestions.value.geo.lon
          },
          radius
        }
    ),
    buyOrRent,
    propertyTypes: removeObjectEmptyArrays(unref(selectedPropertyTypes)),
    priceRange: selectedPriceRange.value,
    bedrooms: bedroomRange.value,
    bathrooms: bathroomRange.value,
    addedToSite: formData?.get("added-to-site"),
    availabilityOptions: formData?.get("include"),
    featured: formattedFeatures,
  };

  // Perform fetch for properties
  const searchResult = await setPendingWhile<ListingCardType[]>(() => {
    return $fetch<ListingCardType[]>("/api/search/listings/", {
      method: "POST",
      body: searchParams.value,
    });
  });

  if (searchListings && searchResult) {
    searchListings.value = searchResult;
  }

  // Hide when search is successful
  hidePopover();
}
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

.o-searchform-fixed {
  top: 0;
  left: 0;
  width: 100%;
  background: none;
  background: var(--background-100);
  color: var(--foreground-100);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-expanded-height);
  z-index: 3;
  box-shadow: 0 20px 60px -20px #{fn.faded-color(12%, var(--monochrome-100))};
  transition: height, background-color;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-out);

  &-contracted {
    height: var(--header-height);
  }
}

.o-searchform-backdrop {
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #{fn.faded-color(25%)};
  cursor: pointer;
}

.o-searchform {
  --searchform-width: 16rem;
  --searchform-width-expanded: 36rem;
  --searchform-popover-expanded: 32rem;
  --searchform-maxwidth: calc(100vw - var(--size-24));
  --popover-radius: var(--size-40);
  --popover-padding: var(--size-20);
  --popover-offset: var(--size-20);

  width: fit-content;
  margin-inline: auto;
  z-index: 2;

  .o-searchform-location {
    transition-property: padding;
  }

  .o-searchform-location-input {
    transition-property: width, height;
    border: none;
    
  }

  .o-searchform-location-button {
    transition-property: width, height, transform;
  }

  .o-searchform-location-button-icon {
    transition-property: opacity;
  }

  .o-searchform-location,
  .o-searchform-location-input,
  .o-searchform-location-button,
  .o-searchform-location-button-icon {
    transition-duration: var(--animation-medium);
    transition-timing-function: var(--ease-out);
  }

  &-expanded {
    .o-searchform-location {
      width: min(var(--searchform-maxwidth), var(--searchform-width-expanded));
      padding: var(--size-10);
    }

    .o-searchform-location-button {
      width: var(--size-48);
      height: var(--size-48);
    }

    .o-searchform-location-button-icon {
      width: var(--size-24);
      height: var(--size-24);
    }

    .o-searchform-location-input {
      font-size: max(var(--font-md), 16px);
    }
  }

  &-contracted {
    padding: var(--size-14) 0;

    .o-searchform-location {
      padding: var(--size-4);
    }

    .o-searchform-location-button:not(.button-pending) {
      transform: scale(0.4);
    }

    .o-searchform-location-button.button-pending {
      transform: scale(0.8);
    }

    .o-searchform-location-button-icon {
      opacity: 0;
    }
  }

  @include mq.small-tablet {
    --searchform-maxwidth: calc(100vw - var(--size-48));
    --searchform-width: 20rem;
    --popover-padding: var(--size-28);
  }

  @include mq.tablet {
    --searchform-width: 24rem;
    --searchform-popover-expanded: 48rem;
    --popover-padding: var(--size-32);
  }
}

.o-searchform-buyrent {
  --switcher-outer-radius: var(--border-radius-pill);
  --switcher-inner-radius: var(--border-radius-pill);

  width: fit-content;
  min-width: 20ch;
  margin-inline: auto;
  margin-bottom: var(--size-10);
}

.o-searchform-location {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--background-200);
  color: var(--foreground-100);
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: var(--size-8);
  grid-gap: var(--size-8);
  border-radius: var(--popover-radius);
  width: min(var(--searchform-maxwidth), var(--searchform-width));
  border: 1px solid var(--background-300);
  margin: 0 auto;
}

.o-searchform-location-input {
  outline: none;
  flex: 1 1;
  width: 0;
  padding-inline: var(--size-12);
  text-align: left;
  font-size: max(var(--font-sm), 16px);
}

.o-searchform-location-radius {
  align-self: stretch;
  height: auto;
  max-width: fit-content;
  flex-grow: 0;
  border-radius: var(--popover-radius);
}

.o-searchform-dropdown {
  // Important to reduce zooming on iOS
  font-size: max(var(--font-sm), 16px);
}

.o-searchform-location:has(.o-searchform-location-input:focus) {
  outline: var(--focus-outline);
}

.o-searchform-location-button {
  width: var(--size-40);
  height: var(--size-40);
  padding: 0;
  flex-shrink: 0;
  align-self: center;
  border-radius: var(--border-radius-pill);
}

.o-searchform-draw-button {
  width: var(--size-40);
  height: var(--size-40);
  padding: 0;
  flex-shrink: 0;
  align-self: center;
  border-radius: var(--border-radius-pill);
  background: var(--background-300);
  border: 1px solid var(--background-400);
  color: var(--foreground-200);
  transition: all var(--animation-medium) var(--ease-out);

  &-active {
    background: var(--secondary-400);
    border-color: var(--primary-200);
    color: var(--monochrome-100);
  }

  &:hover {
    background: var(--background-100);
    border-color: var(--background-200);
    color: var(--monochrome-100);
  
  }

  &-active:hover {
    background: var(--secondary-500);
    color: var(--monochrome-100);
  }
}

.o-searchform-draw-button-icon {
  width: var(--size-20);
  height: var(--size-20);
}

.o-searchform-location-button-icon {
  width: var(--size-20);
  height: var(--size-20);
}

.o-searchform-popover {
  position: absolute;
  top: calc(100% + var(--popover-offset));
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
  border-radius: var(--popover-radius);
  width: min(var(--searchform-maxwidth), var(--searchform-popover-expanded));
  z-index: 2;
  background: var(--background-200);
  color: var(--foreground-100);
  padding: var(--popover-padding);
  border-radius: var(--popover-radius);
  max-height: calc(100vh - var(--header-expanded-height) - var(--popover-offset));
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: #{fn.faded-color(30%)} transparent;

  @include mq.mobile-only {
    background: var(--background-100);
  }

  @supports (max-height: var(--viewport-height)) {
    max-height: calc(var(--viewport-height) - var(--header-expanded-height) - var(--size-12));
  }
}

.o-searchform-toggles {
  list-style: none;
  display: flex;
  // Allows some vertical overflow for animations
  padding: 1em 0 0;
  margin: -1em 0 0;
  // End animation vertical overflow
  gap: var(--size-8);
  white-space: nowrap;
}

/**
 *  Open animatinos
 */
.o-searchform-location {
  view-transition-name: location-search;
}

.o-searchform-location-input {
  view-transition-name: location-input;
}

.o-searchform-location-button {
  view-transition-name: location-button;
}

.o-searchform-popover {
  view-transition-name: popover-search;
}

.o-searchform-buyrent {
  view-transition-name: location-buyrent;
}

::view-transition-group(location-search),
::view-transition-group(location-button),
::view-transition-group(location-input),
::view-transition-group(popover-search),
::view-transition-group(location-buyrent) {
  animation-duration: var(--animation-medium);
  animation-timing-function: var(--ease-out);
}

::view-transition-old(location-search),
::view-transition-new(location-search) {
  height: 100%;
  width: 100%;
}

::view-transition-old(location-input),
::view-transition-new(location-input) {
  width: fit-content
}

/**
 *  Hide/show buy-rent switcher. Do not use view transitions as this
 *  gets laggy when done with scroll events
 */
.buyrent-enter-active,
.buyrent-leave-active {
  interpolate-size: allow-keywords;

  overflow-y: clip;
  transition-property: padding, height, opacity, transform, margin;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-out);
}

.buyrent-enter-from,
.buyrent-leave-to {
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
  height: 0;
  transform: translateY(-2em);
}

/**
 *  Mobile layout
 */
@include mq.mobile-only {
  .o-searchform-fixed {
    --o-searchform-fixed-offset: calc(var(--header-height) + var(--header-expanded-height));

    top: var(--header-height);
  }

  .o-searchform-popover {
    position: fixed;
    border-radius: 0;
    top: var(--o-searchform-fixed-offset);
    left: 0;
    max-width: none;
    width: 100%;
    height: calc(100% - var(--o-searchform-fixed-offset));
    transform: none;
  }
}
</style>
