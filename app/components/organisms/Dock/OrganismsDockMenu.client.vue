<template>
  <ul class="o-dock-menu">
    <li class="o-dock-menu__item">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Results layout</span>

      <OrganismsDockInputsLayout class="o-dock-menu__fix-height" @changed="updateLayout" />
    </li>

    <li class="o-dock-menu__item o-dock-menu__item--shrinkable">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Sort by</span>

      <OrganismsDockInputsSort class="o-dock-menu__fix-height" @update:model-value="updateSortOrder" />
    </li>

    <li class="o-dock-menu__item o-dock-menu__item--shrinkable">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Location</span>

      <OrganismsDockInputsLocation :popovertarget="popoverId" :is-expanded="currentlyOpen === 'location'"
        @click.prevent="showLocationDialog" />
    </li>

    <li class="o-dock-menu__item o-dock-menu__item--fit-content">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Filters</span>

      <OrganismsDockInputsFilters :popovertarget="popoverId" :is-expanded="currentlyOpen === 'filters'"
        @click.prevent="showFiltersDialog">
      </OrganismsDockInputsFilters>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PopoverType, PopoverEmits } from './OrganismsDock.vue'

/**
 *  Props
 */
interface Props {
  popoverId?: string
  currentlyOpen?: PopoverType
}

defineProps<Props>()

/**
 *  Open popover
 */
const emits = defineEmits<PopoverEmits>()

function showLocationDialog() {
  emits('open-popover', 'location')
}

function showFiltersDialog() {
  emits('open-popover', 'filters')
}

/**
 *  Update sort order
 */
function updateSortOrder(newValue: string) {
  console.log('Re-order the results...', newValue)
}

/**
 *  Update layout
 */
function updateLayout(newValue: string) {
  console.log('Update the page layout...', newValue)
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-menu {
  padding: var(--size-8);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--size-8);
  justify-content: stretch;

  @include mq.tablet {
    padding: var(--size-12);
  }

  &__item {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: stretch;
    gap: var(--size-4);
    flex: 1 1 auto;

    &--shrinkable {
      min-width: 4ch;
    }

    &--fit-content {
      flex: 0 0 fit-content;
    }
  }

  &__mobile-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include mq.tablet {
      display: none;
    }
  }

  &__fix-height {
    height: var(--size-40);
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>