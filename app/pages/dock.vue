<template>
  <div class="| container">
    <h1 class="| title-lg">Dock demo</h1>

    <ul class="o-dock" :class="{
      'o-dock--open': currentModal
    }">
      <li class="o-dock__item">
        <span class="o-dock__button-label | faded-text body-2xs">Location</span>
        <button type="button" class="o-dock__button | body-md" :class="{
          'o-dock__button--active': currentModal === 'location'
        }" @click.prevent="showLocationDialog">
          <AtomsIcon icon="search/location" />

          <span class="o-dock__button-text">Location</span>
        </button>
      </li>

      <li class="o-dock__item">
        <span class="o-dock__button-label | faded-text body-2xs">Filters</span>
        <button type="button" class="o-dock__button | body-md" :class="{
          'o-dock__button--active': currentModal === 'filters'
        }" @click.prevent="showFiltersDialog">
          <AtomsIcon icon="search/filter" />

          <span class="o-dock__button-text">AI search</span>
        </button>
      </li>
    </ul>

    <ViewsSearchDialog />
  </div>
</template>

<script setup lang="ts">
import { LazyViewsSearchDialogLocation, LazyViewsSearchDialogFilters } from '#components'

/**
 *  Monitor current modal
 */
const currentModal = shallowRef<string | null>(null)

/**
 *  Toggle modals
 */
const { showDialog } = useSearchDialog()

function showLocationDialog() {
  currentModal.value = 'location'

  showDialog({
    component: LazyViewsSearchDialogLocation,
    onClose: () => {
      currentModal.value = null
    }
  })
}

function showFiltersDialog() {
  currentModal.value = 'filters'

  showDialog({
    component: LazyViewsSearchDialogFilters,
    onClose: () => {
      currentModal.value = null
    }
  })
}
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock {
  list-style: none;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: var(--size-10);
  width: calc(100% - var(--size-24));
  padding: var(--size-8);
  margin: 0;
  background: var(--background-200);
  border-radius: var(--border-radius-xl);
  z-index: 9;
  display: flex;
  align-items: center;
  gap: var(--size-8);
  justify-content: center; // space-between;

  @include mq.tablet {
    bottom: var(--size-16);
    width: min(100% - var(--size-32), 800px);
    padding: var(--size-12);
    gap: var(--size-12);
  }

  @include mq.notebook {
    bottom: var(--size-24);
  }

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

/**
 *  Offset transitions on mobile
 */
.o-dock {
  transition-property: opacity, transform;
  transition-duration: var(--animation-fast);
  transition-timing-function: var(--ease-out);

  &--open {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%);

    @include mq.tablet {
      opacity: unset;
      transform: translateX(-50%);
    }
  }
}

.v-search-dialog__window {
  animation-delay: var(--animation-fast);
  animation-fill-mode: backwards;

  @include mq.tablet {
    animation-delay: 0ms;
  }
}
</style>