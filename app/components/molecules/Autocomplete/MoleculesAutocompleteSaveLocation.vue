<template>
  <div class="m-autocomplete-save-location" :tabindex="-1">
    <button type="button" aria-label="Save pin" :class="customClass" :popovertarget="popoverId">
      <AtomsIcon icon="search/pin" />
    </button>

    <form :id="popoverId" popover class="m-autocomplete-save-location__popover | flow" novalidate autocomplete="off"
      @submit.prevent="saveLocation">
      <label class="| body-xs flow flow-sm faded-text">
        Location nickname

        <input type="text" class="m-autocomplete-save-location__popover-input | body-sm" v-model="locationName" />
      </label>

      <div role="presentation" class="m-autocomplete-save-location__popover-buttons">
        <button type="button" class="| button button-ghost button-xs" @click.prevent="closePopover">
          Cancel
        </button>

        <button type="submit" class="| button button-secondary button-xs">
          Save
        </button>
      </div>
    </form>
  </div>
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
 *  Saving locations
 */
const locationName = ref('')

function saveLocation() {
  console.log({
    name: locationName.value,
    location: props.option
  })
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
}
</style>