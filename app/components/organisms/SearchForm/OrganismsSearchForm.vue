<template>
  <div class="o-searchform-fixed" :class="{
    'o-searchform-fixed-contracted': isContracted,
  }">
    <Teleport to="#teleports">
      <button v-if="!popoverHidden" class="o-searchform-backdrop" aria-label="Hide search form"
        :aria-controls="popoverId" aria-expanded="true"></button>
    </Teleport>

    <form ref="$form" autocomplete="off" class="o-searchform" :class="{
      'o-searchform-expanded': !popoverHidden,
      'o-searchform-contracted': isContracted
    }" @keydown.escape="hidePopover" @submit.prevent="sendForm">
      <Transition name="buyrent">
        <MoleculesSwitcher v-show="!isContracted" class="o-searchform-buyrent" legend="Buy or rent"
          :options="buyOrRentOptions" v-model="buyOrRent" name="buyOrRent" />
      </Transition>

      <div class="| relative" role="presentation">
        <div class="o-searchform-location">
          <input type="search" placeholder="Location" aria-label="Location to search in"
            class="o-searchform-location-input" required @click="showPopover" @focus="showPopover" @input="showPopover"
            v-model="suggestions" name="location" />

          <!-- Search radius (desktop) -->
          <client-only>
            <AtomsSelect aria-label="Search radius" v-if="isTablet && !popoverHidden" :options="radiusOptions"
              v-model="initialRadius" class="o-searchform-location-radius | text-input body-sm focus-visible"
              name="radius" />
          </client-only>

          <AtomsButton type="submit" :pending="isPending" class="o-searchform-location-button | button-monochrome">
            <AtomsIcon title="Search" icon="search" class="o-searchform-location-button-icon" />
          </AtomsButton>
        </div>

        <div :id="popoverId" role="presentation" class="o-searchform-popover | flow flow-xl" :hidden="popoverHidden">
          <MoleculesErrorBox v-if="formErrors" :error="formErrors" />

          <!-- Location -->
          <OrganismsSearchFormTitleBlock v-if="suggestions" title="Location">
            <MoleculesAutocomplete :input="suggestions" :matches="suggestionsMatches"
              v-slot="{ original, current, suggestion }">
              <button class="o-searchform-autocomplete-button | body-md"
                @click.prevent="setSelectedSuggestion(original)">
                <strong class="o-searchform-autocomplete-button-highlight">{{ current }}</strong>{{ suggestion }}
              </button>
            </MoleculesAutocomplete>
          </OrganismsSearchFormTitleBlock>

          <!-- Search readius -->
          <client-only>
            <OrganismsSearchFormTitleBlock v-if="!isTablet">
              <MoleculesFormField label="Search radius" v-slot="{ id }">
                <AtomsSelect :id :options="radiusOptions" v-model="initialRadius"
                  class="| text-input body-sm focus-visible" name="radius" />
              </MoleculesFormField>
            </OrganismsSearchFormTitleBlock>
          </client-only>

          <!-- price -->
          <animate-in :delay="50">
            <OrganismsSearchFormTitleBlock title="Price">
              <animate-in :delay="75">
                <LazyMoleculesRangeSlider v-model="selectedPriceRange" :min="priceMin" :max="priceMax"
                  :starting-min="priceMin" :starting-max="priceMax" :graph-data="priceRangeGraph" hydrate-on-visible />
              </animate-in>
            </OrganismsSearchFormTitleBlock>
          </animate-in>

          <!-- bedrooms & bathrooms -->
          <animate-in :delay="75">
            <OrganismsSearchFormGrid>
              <OrganismsSearchFormTitleBlock title="Bedrooms">
                <OrganismsSearchFormGrid grid-auto>
                  <animate-in :delay="75">
                    <OrganismsSearchFormFlex>
                      <span aria-hidden class="| body-sm">Between</span>
                      <AtomsSelect v-model="bedroomRange[0]" :options="bedroomOptions"
                        class="| text-input body-sm focus-visible" name="min-bedrooms" aria-label="Minimum bedrooms" />
                    </OrganismsSearchFormFlex>
                  </animate-in>

                  <animate-in :delay="100">
                    <OrganismsSearchFormFlex>
                      <span aria-hidden class="| body-sm">and</span>
                      <AtomsSelect v-model="bedroomRange[1]" :options="bedroomOptions"
                        class="| text-input body-sm focus-visible" name="max-bedrooms" aria-label="Maximum bedrooms" />
                    </OrganismsSearchFormFlex>
                  </animate-in>
                </OrganismsSearchFormGrid>
              </OrganismsSearchFormTitleBlock>

              <OrganismsSearchFormTitleBlock title="Bathrooms">
                <OrganismsSearchFormGrid grid-auto>
                  <animate-in :delay="125">
                    <OrganismsSearchFormFlex>
                      <span aria-hidden class="| body-sm">Between</span>
                      <AtomsSelect v-model="bathroomRange[0]" :options="bathroomOptions"
                        class="| text-input body-sm focus-visible" name="min-bathrooms"
                        aria-label="Minimum bathrooms" />
                    </OrganismsSearchFormFlex>
                  </animate-in>

                  <animate-in :delay="150">
                    <OrganismsSearchFormFlex>
                      <span aria-hidden class="| body-sm">and</span>
                      <AtomsSelect v-model="bathroomRange[1]" :options="bathroomOptions"
                        class="| text-input body-sm focus-visible" name="max-bathrooms"
                        aria-label="Maximum bathrooms" />
                    </OrganismsSearchFormFlex>
                  </animate-in>
                </OrganismsSearchFormGrid>
              </OrganismsSearchFormTitleBlock>
            </OrganismsSearchFormGrid>
          </animate-in>

          <!-- property types -->
          <animate-in :delay="150">
            <OrganismsSearchFormTitleBlock title="Property type">
              <MoleculesScrollBox class="| focus-overflow">
                <ul class="o-searchform-toggles">
                  <animate-in v-for="({ id, name, defaultSelected }, index) of propertyTypes" :delay="150 + index * 30">
                    <li :key="id">
                      <AtomsToggleBox :label="name" :checked="defaultSelected" type="checkbox" :name />
                    </li>
                  </animate-in>
                </ul>
              </MoleculesScrollBox>
            </OrganismsSearchFormTitleBlock>
          </animate-in>

          <!-- Date Added and Include Options -->
          <OrganismsSearchFormGrid v-show="popoverExpanded" class="o-searchform-animation">
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

            <animate-in :delay="25">
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
          </OrganismsSearchFormGrid>

          <!-- popular features -->
          <animate-in :delay="50">
            <OrganismsSearchFormTitleBlock v-show="popoverExpanded" title="Popular Features">
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
import type { PropertyType } from "@prisma/client";
import { onClickOutside, watchDebounced } from "@vueuse/core";
import type { MinMaxPriceResponse } from "~~/shared/types/price";
import { useMediaQuery } from '@vueuse/core'

/**
 *  a11y
 */
const popoverId = useId()

/**
 *  Whether to show the radius dropdown inline or below
 */
const isTablet = useMediaQuery('(min-width: 768px)')

/**
 *  Determine whether to shrink the search form
 */
const isScrolled = ref(false)

useScrollThreshold(50, (newValue) => {
  isScrolled.value = newValue
})

const isContracted = computed(() => {
  return isScrolled.value && popoverHidden.value
})

/**
 *  Get search form config
 */
const { radiusOptions, bedroomOptions, bathroomOptions, dateOptions, saleAvailabilityOptions, rentAvailabilityOptions, propertyFeatures, buyOrRentOptions } = getSearchFormConfig();

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
const bedroomRange = ref<[number, number]>([0, 0]);
const bathroomRange = ref<[number, number]>([0, 0]);
const initialRadius = computed(() => radiusOptions?.[0]?.value);
const initialDate = computed(() => dateOptions?.[0]?.value);
const buyOrRent = ref("buy");
const includeOptions = ref<{ value: string; key: string }[]>([]);
const initialInclude = computed(() => includeOptions.value?.[0]?.value);
const searchParams = useState<Record<string, any>>("searchParams");

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
const isBuy = computed(() => (buyOrRent.value === "buy" ? true : false));

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
const { data: priceRangeGraph } = useAsyncData('price-graph', () => {
  return $fetch("/api/price/graph", {
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

watch(
  buyOrRent,
  () => {
    if (buyOrRent.value === "rent") {
      includeOptions.value = rentAvailabilityOptions;
    } else if (buyOrRent.value === "buy") {
      includeOptions.value = saleAvailabilityOptions;
    }
  },
  { immediate: true }
);

/**
 *  Pending states
 */
const { isPending, setPendingWhile } = usePending()

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
  const formattedPropertyTypes = formatPropertyTypes(propertyTypes, formData);
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
   * Save search params to state
   */
  searchParams.value = {
    location,
    radius,
    buyOrRent,
    propertyTypes: formattedPropertyTypes,
    priceRange: selectedPriceRange.value,
    bedrooms: bedroomRange.value,
    bathrooms: bathroomRange.value,
    addedToSite: formData?.get("added-to-site"),
    availabilityOptions: formData?.get("include"),
    featured: formattedFeatures,
  };

  // Perform fetch for properties
  const searchResult = await setPendingWhile<ListingCardType[]>(() => {
    return $fetch<ListingCardType[]>("/api/search/listings", {
      method: "POST",
      body: searchParams.value,
    });
  })

  if (searchListings && searchResult) {
    searchListings.value = searchResult;
  }

  // Hide popover when search is successful
  hidePopover();
}
</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

.o-searchform-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: var(--background-100);
  color: var(--foreground-100);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--header-expanded-height);
  z-index: 3;
  box-shadow: 0 20px 60px -20px #{fn.faded-color(12%, var(--monochrome-100))};
  transition: height var(--animation-medium) var(--ease-out);

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
  --searchform-width-expanded: 32rem;
  --searchform-maxwidth: calc(100vw - var(--size-24));
  --popover-radius: var(--size-40);
  --popover-gap: var(--size-12);
  --popover-padding: var(--size-20);

  transition-property: padding;
  width: fit-content;
  margin-inline: auto;
  z-index: 2;

  .o-searchform-location-input,
  .o-searchform-location-button {
    transition-property: width, height;
  }

  .o-searchform-location-button-icon {
    transition-property: opacity;
  }

  .o-searchform,
  .o-searchform-location-input,
  .o-searchform-location-button,
  .o-searchform-location-button-icon {
    transition-duration: var(--animation-medium);
    transition-timing-function: var(--ease-out);
  }

  &-expanded {
    .o-searchform-location {
      width: min(var(--searchform-maxwidth), var(--searchform-width-expanded));
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
      font-size: var(--font-md);
    }
  }

  &-contracted {
    padding: var(--size-14) 0;

    .o-searchform-location {
      padding: var(--size-6) var(--size-10);
    }

    .o-searchform-location-button {
      width: var(--size-24);
      height: var(--size-24);
    }

    .o-searchform-location-button-icon {
      opacity: 0;
    }
  }

  @include mq.small-tablet {
    --searchform-maxwidth: calc(100vw - var(--size-48));
    --searchform-width: 20rem;
    --popover-padding: var(--size-28);
    --popover-gap: var(--size-16);
  }

  @include mq.tablet {
    --searchform-width: 24rem;
    --searchform-width-expanded: 48rem;
    --popover-gap: var(--size-20);
    --popover-padding: var(--size-32);
  }

  @include mq.desktop {
    --popover-gap: var(--size-24);
  }
}

.o-searchform-buyrent {
  --switcher-outer-radius: var(--border-radius-pill);
  --switcher-inner-radius: var(--border-radius-pill);

  width: fit-content;
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

  @include mq.small-tablet {
    &-expanded {
      padding: var(--size-12);
      gap: var(--size-12);
    }
  }
}

.o-searchform-location-input {
  outline: none;
  flex: 1 1;
  width: 0;
  padding-inline: var(--size-12);
  text-align: left;
  font-size: var(--font-sm);
}

.o-searchform-location-radius {
  align-self: stretch;
  height: auto;
  max-width: fit-content;
  flex-grow: 0;
  border-radius: var(--popover-radius);
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

.o-searchform-location-button-icon {
  width: var(--size-20);
  height: var(--size-20);
}

.o-searchform-popover {
  position: absolute;
  top: calc(100% + var(--size-12));
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
  border-radius: var(--popover-radius);
  width: min(var(--searchform-maxwidth), var(--searchform-width-expanded));
  z-index: 2;
  background: var(--background-200);
  color: var(--foreground-100);
  padding: var(--popover-padding);
  border-radius: var(--popover-radius);
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
</style>
