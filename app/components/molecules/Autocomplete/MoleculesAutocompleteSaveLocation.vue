<template>
  <div v-if="!entryExists" class="m-autocomplete-save-location" :tabindex="-1">
    <button type="button" aria-label="Save pin" :class="customClass" :popovertarget="popoverId" @click="validUser">
      <AtomsIcon icon="search/pin" />
    </button>

    <form :id="popoverId" popover class="m-autocomplete-save-location__popover | elevate-200" novalidate
      autocomplete="off" @submit.prevent="saveLocation">
      <label class="m-autocomplete-save-location__popover-label | body-xs faded-text">
        Name

        <input type="text" class="m-autocomplete-save-location__popover-input | text-input body-sm"
          v-model="locationName" placeholder="e.g. Home" />
      </label>

      <div role="presentation" class="m-autocomplete-save-location__popover-buttons">
        <AtomsButton type="button" class="| button button-bordered button-xs" :disabled="isPending"
          @click.prevent="closePopover">
          Cancel
        </AtomsButton>

        <AtomsButton type="submit" class="| button button-secondary button-xs" :disabled="!locationName || isPending"
          :pending="isPending">
          Save
        </AtomsButton>
      </div>
    </form>
  </div>
  <span v-else class="m-autocomplete-save-location__existing | body-xs">
    {{ entryExists.name }}
  </span>
</template>

<script setup lang="ts">
import { ViewsDialogLogin } from '#components';

interface Props {
  option: GeocodingFeature
  customClass: string
}

const props = defineProps<Props>()

/**
 *  Check if user is logged in
 */
const { loggedIn } = useUserSession();
const { showDialog } = useDialog()

function validUser(e: Event) {
  if (!loggedIn.value) {
    e.preventDefault()

    showDialog({
      component: ViewsDialogLogin,
    });
  }
}


/**
 *  Expanding popover
 */
const popoverId = useId()

function closePopover() {
  const popover = document.getElementById(popoverId)

  if (popover?.hidePopover) {
    popover.hidePopover()
  }
}

/**
 *  Check if entry already exists
 */
const entryExists = computed(() => {
  const { option } = props

  return checkSavedLocation(option)
})

/**
 *  Saving locations
 */
const locationName = ref('')

const { checkEntry: checkSavedLocation, addEntry: addSavedLocation } = useSavedLocation()
const { enhanceWithBoundaryPolygon } = useMap()
const { isPending, setPendingWhile } = usePending()

async function saveLocation() {
  const name = locationName.value.trim();

  if (!name) return;

  await setPendingWhile(async () => {
    const { option } = props
    const { geometry, place_name_en, bbox } = asObject(option)
    const { coordinates } = asObject(geometry)

    // Enhance the geocoding feature with boundary polygon for map visualization
    // This fetches the actual boundary shape from MapTiler if available
    const enhancedFeature = await enhanceWithBoundaryPolygon(option)

    await addSavedLocation({
      name,
      lat: (coordinates as [number, number])[0],
      lon: (coordinates as [number, number])[1],
      location: place_name_en,
      bbox: bbox as [number, number, number, number] | undefined,
      geocodingFeature: enhancedFeature // Now includes boundaryPolygon if available
    } as UserSavedLocation);

    closePopover()
  });
}
</script>

<style lang="scss">
@use 'sass:math';

.m-autocomplete-save-location {
  position: relative;

  &:focus-within {
    color: var(--primary-400);
  }

  &__popover {
    position: fixed;
    inset: unset;
    background: var(--background-100);
    padding: var(--size-14) var(--size-16) var(--size-16);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color-200);
    top: calc(anchor(bottom) + var(--size-14));
    right: calc(anchor(right) - var(--size-14));
    width: fit-content;
    overflow: visible;
    z-index: 2;
    gap: var(--size-10);
    flex-direction: column;

    &:popover-open {
      display: flex;
    }

    &::before {
      $arrow-size: 12px;
      $arrow-size-half: math.div($arrow-size, 2);

      content: '';
      position: absolute;
      top: -#{ $arrow-size-half };
      right: calc(var(--size-12) + #{ $arrow-size-half });
      width: $arrow-size;
      height: $arrow-size;
      transform: rotate(45deg);
      background: var(--background-100);
      border-top: 1px solid var(--border-color-200);
      border-left: 1px solid var(--border-color-200);
      border-top-left-radius: 2px;
    }
  }

  &__popover-label {
    line-height: var(--lineheight-md);
    display: flex;
    flex-direction: column;
  }

  &__popover-input {
    display: block;
    width: 20ch;
    height: 2.8em;
    padding-inline: var(--size-12);
  }

  &__popover-buttons {
    display: flex;
    align-items: stretch;
    gap: var(--size-10);

    button {
      flex: 1 1 50%;
      border-radius: var(--border-radius-ui);
    }
  }

  &__existing {
    background: var(--background-300);
    padding: var(--size-6) var(--size-12);
    border-radius: var(--border-radius-pill);
    max-width: 15ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>