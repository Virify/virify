<template>
  <form @submit.prevent="hidePopover" class="| flow">
    <div role="presentation" ref="$location" class="m-ai-search-form-location__container | flow flow-lg">
      <fieldset class="m-ai-search-form-location__fieldset | elevate-200">
        <legend class="| visually-hidden">Location</legend>

        <input type="text" class="m-ai-search-form-location__input | body-md" placeholder="Where do you want to live?"
          aria-label="Location" v-model="locationQuery" @input="updateAutocompleteValue" @focus="showPopover" />

        <AtomsSelect name="radius" id="radius" aria-label="Location radius"
          class="m-ai-search-form-location__radius m-ai-search-form-location__radius--desktop | body-md"
          v-model="searchState.radius" :options="selectOptionRadius" @change="handleRadiusSelected" />
      </fieldset>

      <client-only>
        <Transition name="m-ai-search-form-location">
          <div role="presentation" v-show="popoverExpanded">
            <MoleculesAutocompletePopover :search-value="autocompleteValue"
              @location-selected="handleLocationSelected" />
          </div>
        </Transition>
      </client-only>
    </div>

    <AtomsSelect name="radius" id="radius" aria-label="Location radius"
      class="m-ai-search-form-location__radius m-ai-search-form-location__radius--mobile | body-md"
      v-model="searchState.radius" :options="selectOptionRadius" @change="handleRadiusSelected" />
  </form>
</template>

<script setup lang="ts">
import { onClickOutside, useDebounceFn } from "@vueuse/core";

/**
 *  Set autocomplete value
 */
const autocompleteValue = ref('')

const getAutocomplete = useDebounceFn((value: string) => {
  autocompleteValue.value = value
}, 200)

function updateAutocompleteValue({ target }: Event) {
  const { value } = asObject(target)

  showPopover()
  getAutocomplete(value as string)
}

/**
 *  Global and input state
 */
const { searchState } = useSearchState()

// Local input value - synced with global state but editable
const locationQueryLocal = ref('')

// Sync from global state when location changes
watch(() => searchState.value?.location, (location) => {
  if (location) {
    locationQueryLocal.value = location.place_name_en || location.place_name || ''
  }
}, { immediate: true })

// Expose as locationQuery for template
const locationQuery = computed({
  get: () => locationQueryLocal.value,
  set: (value: string) => { locationQueryLocal.value = value }
})

/**
 *  Handle autocomplete events
 */
const { setLocation, setLocationRadius } = useSearchState()
const { enhanceWithBoundaryPolygon } = useMap();

async function handleLocationSelected(location: MaybeRef<GeocodingFeature>) {
  const locationUnref = unref(location)

  // Get enhanced location, falling back to normal location
  const enhancedLocation = await enhanceWithBoundaryPolygon(locationUnref)
    .catch(() => locationUnref);

  // Update input immediately with full location name
  locationQueryLocal.value = enhancedLocation.place_name_en || enhancedLocation.place_name || ''

  // Update global state
  setLocation(enhancedLocation, hidePopover)
}

/**
 *  Update radius via state when updated
 */
function handleRadiusSelected() {
  const { radius } = asObject(searchState.value)

  setLocationRadius(Number(radius) || 0)
}

/**
 *  Handle popover controls
 */
const $location = useTemplateRef('$location')

const popoverExpanded = ref(false);

const showPopover = () => { popoverExpanded.value = true; };
const hidePopover = () => { popoverExpanded.value = false; };

onClickOutside($location, hidePopover);

</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

.m-ai-search-form-location {

  &__fieldset {
    background: var(--background-200);
    color: var(--foreground-100);
    border-radius: var(--border-radius-xl);
    align-items: center;
    border: 1px solid var(--border-color-200);

    @include mq.tablet {
      display: grid;
      padding: var(--size-16);
      gap: var(--size-16);
      grid-template-columns: 1fr auto;
      border-radius: var(--border-radius-2xl);

      &:has(input:focus) {
        outline: var(--focus-outline);
      }
    }
  }

  &__radius,
  &__input {
    background-color: transparent;
    color: currentColor;
    border-radius: var(--border-radius-lg);

    @include mq.tablet {
      border-radius: var(--border-radius-xl);
    }
  }

  &__input {
    padding: var(--size-14) var(--size-16);
    width: 100%;

    @include mq.tablet {
      width: auto;

      &:focus {
        outline: none;
      }
    }
  }

  &__radius {
    background-color: var(--background-100);
    border: 1px solid var(--border-color-200);
    padding: var(--size-10) var(--size-18);
    padding-right: var(--size-48);

    &--mobile {
      display: unset;
      width: 100%;
    }

    &--desktop {
      display: none;
      padding: var(--size-14) var(--size-18);
      padding-right: var(--size-48);
    }

    @include mq.tablet {
      &--mobile {
        display: none;
      }

      &--desktop {
        display: unset;
      }
    }
  }
}

/**
 * Location transitions
 */
.m-ai-search-form-location-enter-active,
.m-ai-search-form-location-leave-active {
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

.m-ai-search-form-location-leave-to,
.m-ai-search-form-location-enter-from {
  height: 0;
  margin: 0;

  >* {
    opacity: 0;
  }
}
</style>