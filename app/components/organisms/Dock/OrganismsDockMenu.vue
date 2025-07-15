<template>
  <ul class="o-dock-menu">
    <li class="o-dock-menu__item">
      <span class="o-dock-menu__button-label | faded-text body-2xs">Location</span>

      <button type="button" :popovertarget="popoverId" class="o-dock-menu__button | body-md" :class="{
        'o-dock-menu__button--active': currentlyOpen === 'location'
      }" @click.prevent="showLocationDialog">
        <AtomsIcon icon="search/location" />

        <span class="o-dock-menu__button-text">Location</span>
      </button>
    </li>

    <li class="o-dock-menu__item">
      <span class="o-dock-menu__button-label | faded-text body-2xs">Filters</span>

      <button type="button" :popovertarget="popoverId" class="o-dock-menu__button | body-md" :class="{
        'o-dock-menu__button--active': currentlyOpen === 'filters'
      }" @click.prevent="showFiltersDialog">
        <AtomsIcon icon="search/filter" />

        <span class="o-dock-menu__button-text">AI search</span>
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

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-menu {
  &__item {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: center;
    gap: var(--size-4);
  }

  &__button-label {

    @include mq.tablet {
      display: none;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
    background: var(--background-300);
    border-radius: var(--border-radius-lg);
    padding: var(--size-10) var(--size-14);
    line-height: var(--lineheight-md);

    .a-icon {
      width: var(--size-24);
      height: var(--size-24);
    }

    @include mq.tablet {

      &--active {
        background: var(--secondary-400);
        color: var(--monochrome-900);
      }
    }
  }

  &__button-text {
    display: none;

    @include mq.tablet {
      display: unset;
    }
  }
}
</style>