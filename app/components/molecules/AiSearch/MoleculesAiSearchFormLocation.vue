<template>
  <form @submit.prevent="hidePopover" class="| flow" tabindex="-1" @keydown.escape="hidePopover">
    <div role="presentation" ref="$location" class="m-ai-search-form-location__container | flow flow-lg">
      <fieldset class="m-ai-search-form-location__fieldset | gradient-box">
        <legend class="| visually-hidden">Location</legend>

        <input ref="$searchInput" type="text" class="m-ai-search-form-location__input | body-md"
          placeholder="Where do you want to live?" aria-label="Location" v-model="locationText" @focus="showPopover"
          @input="updateLoctionQuery" />

        <AtomsSelect name="radius" aria-label="Location radius"
          class="m-ai-search-form-location__radius m-ai-search-form-location__radius--desktop | body-md"
          v-model="radius" :options="selectOptionRadius" @change="handleRadiusSelected" />
      </fieldset>

      <client-only>
        <Transition name="m-ai-search-form-location">
          <div role="presentation" class="m-ai-search-form-location__popover" v-show="popoverExpanded">
            <MoleculesAutocompletePopover :search-value="locationTextLocal"
              @location-selected="handleLocationSelected" />
          </div>
        </Transition>
      </client-only>
    </div>

    <AtomsSelect name="radius" aria-label="Location radius"
      class="m-ai-search-form-location__radius m-ai-search-form-location__radius--mobile | body-md" v-model="radius"
      :options="selectOptionRadius" @change="handleRadiusSelected" />
  </form>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";

/**
 *  Emits
 */
const emit = defineEmits(['location-selected'])

/**
 *  Set autocomplete value. Set as useState rather than shallowRef so
 *  that the model syncs across all inputs (e.g. modal and dock)
 */
const { locationText, setLocationText } = useLocationInput()

/**
 *  Store a local copy of locationText - this prevents the
 *  autocomplete watcher firing multiple times if the component
 *  appears multiple times on the page (e.g. modal and dock)
 */
const locationTextLocal = shallowRef('')

function updateLoctionQuery({ target }: InputEvent) {
  locationTextLocal.value = (target as HTMLInputElement)?.value

  showPopover()
}

/**
 *  Handle autocomplete events
 */
const { locationName, radius, setLocation, setRadius } = useGlobalSearchState()
const { enhanceWithBoundaryPolygon } = useMap();

async function handleLocationSelected(selectedLocation: MaybeRef<GeocodingFeature>) {
  const locationUnref = unref(selectedLocation)

  // Get enhanced location, falling back to normal location
  const enhancedLocation = await enhanceWithBoundaryPolygon(locationUnref)
    .catch(() => locationUnref);

  // Update global state
  setLocation(enhancedLocation)

  // Sync location with useState location
  if (isString(locationName.value) && locationText.value !== locationName.value) {
    setLocationText(locationName.value)
  }

  // Close popover
  hidePopover()

  // Let DOM refresh before showing modal, so location popover is closed
  await nextTick()

  // Emit event to parent
  emit('location-selected')
}

/**
 *  Update radius via state when updated
 */
async function handleRadiusSelected({ target }: InputEvent) {
  // Update radius for location
  setRadius((target as HTMLSelectElement)?.value)

  // Let DOM refresh before showing modal, so location popover is closed
  await nextTick()

  // Emit event to parent
  emit('location-selected')
}

/**
 *  Handle popover controls
 */
const $location = useTemplateRef('$location')

const popoverExpanded = ref(false);

const showPopover = () => { popoverExpanded.value = true; };
const hidePopover = () => { popoverExpanded.value = false; };

onClickOutside($location, hidePopover);

/**
 *  Show popover if focused on first mount
 */
const $searchInput = useTemplateRef('$searchInput')

onMounted(() => {
  const input = unref($searchInput)

  // If input is not an element, do nothing
  if (!isElement(input)) return

  // If input is focused
  if (input === document.activeElement) {
    showPopover()
  }
})

</script>

<style lang="scss">
@use "#styles/_utils/functions" as fn;
@use "#styles/_utils/media" as mq;

.m-ai-search-form-location {

  &__fieldset {
    background: var(--background-100);
    color: var(--foreground-100);
    align-items: center;

    @include mq.not-tablet {
      --gradient-box-shadow: none;
      --gradient-box-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;

      border: 0;
    }

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

  &__popover {
    text-align: left;

    @include mq.not-tablet {
      margin: 0;

      .m-autocomplete-popover {
        border-radius: 0;
        border-width: 2px;
        border-top: 0;
        border-bottom: 0;
      }
    }
  }

  &__radius,
  &__input {
    background-color: transparent;
    color: currentColor;
    border-radius: var(--border-radius-xl);
  }

  &__input {
    padding: var(--size-14) var(--size-16);
    width: 100%;

    @include mq.not-tablet {
      border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
    }

    @include mq.tablet {
      width: auto;

      &:focus {
        outline: none;
      }
    }
  }

  &__radius {
    background-color: var(--background-200);
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

    @include mq.not-tablet {
      margin-top: 0;
      border-top: 0;
      border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
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