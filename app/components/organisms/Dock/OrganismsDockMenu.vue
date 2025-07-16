<template>
  <ul class="o-dock-menu">
    <li class="o-dock-menu__item">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Results layout</span>

      <OrganismsDockInputsLayout class="o-dock-menu__input-height" @changed="updateLayout" />
    </li>

    <li class="o-dock-menu__item">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Sort by</span>

      <OrganismsDockInputsSort class="o-dock-menu__input-height" @update:model-value="updateSortOrder" />
    </li>

    <li class="o-dock-menu__item">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Location</span>

      <button type="button" :popovertarget="popoverId" class="o-dock-menu__input o-dock-menu__input-height | body-md"
        :class="{
          'o-dock-menu__input--active': currentlyOpen === 'location'
        }" @click.prevent="showLocationDialog">
        <AtomsIcon icon="search/location" />

        <span class="o-dock-menu__input-text">Location</span>
      </button>
    </li>

    <li class="o-dock-menu__item">
      <span class="o-dock-menu__mobile-label | faded-text body-2xs">Filters</span>

      <button type="button" :popovertarget="popoverId" class="o-dock-menu__input o-dock-menu__input-height | body-md"
        :class="{
          'o-dock-menu__input--active': currentlyOpen === 'filters'
        }" @click.prevent="showFiltersDialog">
        <AtomsIcon icon="search/filter" />

        <span class="o-dock-menu__input-text">AI search</span>
      </button>
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
    flex: 1 0 auto;
  }

  &__mobile-label {

    @include mq.tablet {
      display: none;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
    background: var(--background-300);
    border-radius: var(--border-radius-xl);
    padding: var(--size-6) var(--size-16);
    line-height: var(--size-24);
    font-size: var(--font-md);
    font-weight: var(--font-semibold);
    white-space: nowrap;
    flex: 1 0 auto;
    width: 100%;

    .a-icon {
      flex: 0 0 auto;
      width: var(--size-24);
      height: var(--size-24);
    }

    @include mq.tablet {
      font-size: var(--font-sm);

      &:open,
      &--active {
        background-color: var(--secondary-400);
        color: var(--monochrome-900);
      }
    }
  }

  &__input-height {
    height: var(--size-40);
    padding-top: 0;
    padding-bottom: 0;
  }

  &__input-text {
    display: none;

    @include mq.tablet {
      display: unset;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>