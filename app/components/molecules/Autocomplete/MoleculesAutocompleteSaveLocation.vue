<template>
  <div v-if="!entryExists" class="m-autocomplete-save-location" :tabindex="-1">
    <button type="button" aria-label="Save pin" :class="customClass" :popovertarget="popoverId">
      <AtomsIcon icon="search/pin" />
    </button>

    <form :id="popoverId" popover class="m-autocomplete-save-location__popover | flow" novalidate autocomplete="off"
      @submit.prevent="saveLocation">
      <label class="| body-xs flow flow-sm faded-text">
        Location name

        <input type="text" class="m-autocomplete-save-location__popover-input | body-sm" v-model="locationName"
          placeholder="e.g. Home" />
      </label>

      <div role="presentation" class="m-autocomplete-save-location__popover-buttons">
        <button type="button" class="| button button-ghost button-xs" :disabled="isPending"
          @click.prevent="closePopover">
          Cancel
        </button>

        <button type="submit" class="| button button-secondary button-xs" :disabled="!locationName || isPending">
          Save
        </button>
      </div>
    </form>
  </div>
  <span v-else class="m-autocomplete-save-location__existing | body-xs">
    {{ entryExists.name }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  option: unknown
  customClass: string
}

const props = defineProps<Props>()

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
const { isPending, setPendingWhile } = usePending()

async function saveLocation() {
  const name = locationName.value.trim();

  if (!name) return;

  await setPendingWhile(async () => {
    const { option } = props
    const { geometry, place_name_en } = asObject(option)
    const { coordinates = [] } = asObject(geometry)

    await addSavedLocation({
      name,
      lat: (coordinates as number[])[0],
      lon: (coordinates as number[])[1],
      location: place_name_en,
      geocodingFeature: option
    });

    closePopover()
  });
}
</script>

<style lang="scss">
.m-autocomplete-save-location {
  position: relative;

  &:focus-within {
    color: var(--secondary-400);
  }

  &__popover {
    position: absolute;
    inset: unset;
    background: var(--background-200);
    padding: var(--size-12);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color-200);
    top: calc(anchor(bottom) + var(--size-10));
    right: anchor(right);
    width: fit-content;
    z-index: 2;
  }

  &__popover-input {
    display: block;
    width: 20ch;
    height: 2.8em;
    background: var(--background-300);
    border: 0;
    padding-inline: var(--size-12);
    border-radius: var(--border-radius-ui);
  }

  &__popover-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--size-8);
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