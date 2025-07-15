<template>
  <div class="| container">
    <h1 class="| title-lg">Dock demo</h1>

    <div ref="$popover" popover="auto" :id="popoverId" class="o-dock__popover o-dock-container | elevate-200"
      tabindex="-1">
      <button class="o-dock__popover-close | button button-quiet" aria-label="Close modal" aria-controls="modal"
        @click.prevent="closePopover">
        <AtomsIcon icon="cross" aria-hidden class="o-dock__popover-close-icon" />
      </button>

      <template v-if="popover">
        <component :is="popover.component" v-bind="popover.props" />

        <div class="o-dock__popover-buttons">
          <button :popovertarget="popoverId" v-if="!isFilters" class="| button button-sm button-ghost"
            @click.prevent="showFiltersDialog">
            Filters
          </button>
          <button :popovertarget="popoverId" v-if="!isLocation" class="| button button-sm button-ghost"
            @click.prevent="showLocationDialog">
            Locations
          </button>
          <button class="| button button-sm button-secondary" @click.prevent="closePopover">
            Show results
          </button>
        </div>
      </template>
    </div>

    <ul class="o-dock o-dock-container | elevate-300">
      <li class="o-dock__item">
        <span class="o-dock__button-label | faded-text body-2xs">Location</span>

        <button type="button" :popovertarget="popoverId" class="o-dock__button | body-md" :class="{
          'o-dock__button--active': popover?.type === 'location'
        }" @click.prevent="showLocationDialog">
          <AtomsIcon icon="search/location" />

          <span class="o-dock__button-text">Location</span>
        </button>
      </li>

      <li class="o-dock__item">
        <span class="o-dock__button-label | faded-text body-2xs">Filters</span>

        <button type="button" :popovertarget="popoverId" class="o-dock__button | body-md" :class="{
          'o-dock__button--active': popover?.type === 'filters'
        }" @click.prevent="showFiltersDialog">
          <AtomsIcon icon="search/filter" />

          <span class="o-dock__button-text">AI search</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { LazyViewsSearchPopoverLocation, LazyViewsSearchPopoverFilters } from '#components'

interface Popover {
  type: 'location' | 'filters'
  component: Component
  props?: Record<string, unknown>
}

/**
 *  Monitor current modal
 */
const popoverId = useId()
const popover = shallowRef<null | Popover>(null)

/**
 *  Toggle popovers
 */
const $popover = useTemplateRef('$popover')

function showPopover() {
  $popover.value?.showPopover()
  $popover.value?.focus()
}

function hidePopover() {
  $popover.value?.hidePopover()
}

function showLocationDialog() {
  popover.value = {
    type: 'location',
    component: LazyViewsSearchPopoverLocation,
  }

  showPopover()
}

function showFiltersDialog() {
  popover.value = {
    type: 'filters',
    component: LazyViewsSearchPopoverFilters,
  }

  showPopover()
}

function closePopover() {


  hidePopover()
}

/**
 *  Check popover states
 */
const isLocation = computed(() => popover.value?.type === 'location')
const isFilters = computed(() => popover.value?.type === 'filters')

/**
 *  Monitor close events
 */
onMounted(() => {
  $popover.value?.addEventListener('toggle', (event) => {
    const { newState } = asObject(event)

    if (newState !== 'closed') return

    popover.value = null
  })
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-container {
  background: var(--background-200);
  border-radius: var(--border-radius-2xl);
  width: calc(100% - var(--size-24));

  @include mq.small-tablet {
    width: min(100% - var(--size-32), 450px);
  }

  @include mq.tablet {
    width: min(100% - var(--size-32), 800px);
  }
}

.o-dock {
  list-style: none;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: var(--size-10);
  padding: var(--size-8);
  margin: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  gap: var(--size-8);
  justify-content: center;


  @include mq.tablet {
    bottom: var(--size-16);
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

  &__popover {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
    bottom: var(--size-12);
    max-height: calc(100dvh - var(--size-24));
    padding: var(--size-16);
    padding-top: var(--size-48);
    margin: 0;
    z-index: 10;
    overflow: auto;
    scrollbar-width: thin;

    &:popover-open {
      display: block;
    }

    @include mq.tablet {
      $dock-height: 80px;

      bottom: calc(var(--size-16) + #{ $dock-height });
      max-height: calc(100dvh - var(--size-32) - #{ $dock-height });
      padding: var(--size-32);
      padding-top: var(--size-48);
    }

    @include mq.notebook {
      $dock-height: 80px;

      bottom: calc(var(--size-24) + #{ $dock-height });
      max-height: calc(100dvh - var(--size-48) - #{ $dock-height });
    }

    @include mq.motion {
      animation: fadeDockPopover var(--animation-medium) var(--ease-out);
    }
  }

  &__popover-close {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
    padding: var(--size-8);
    width: var(--size-42);
    height: var(--size-42);
  }

  &__popover-close-icon {
    display: block;
    width: var(--size-24);
    height: var(--size-24);
  }

  &__popover-buttons {
    display: flex;
    padding: var(--size-16) 0 0;
    align-items: center;
    justify-content: stretch;
    gap: var(--size-8);

    .button {
      flex: 1 1 50%;
    }

    @include mq.tablet {
      display: none;
    }
  }
}

/**
 *  Offset transitions on mobile
 *
 *  @TODO
 *  There is a bug in Safari where :popover-open is always true,
 *  meaning the popover opacity never gets removed. Temporarily
 *  disabling
 */
// .o-dock {
//   transition-property: opacity, transform;
//   transition-duration: var(--animation-fast);
//   transition-timing-function: var(--ease-out);
//   &__popover:popover-open+.o-dock {
//     opacity: 0;
//     transform: translateX(-50%) translateY(-50%);

//     @include mq.tablet {
//       opacity: unset;
//       transform: translateX(-50%);
//     }

//     &__popover:popover-open {
//       animation-delay: var(--animation-fast);
//       animation-fill-mode: backwards;

//       @include mq.tablet {
//         animation-delay: 0ms;
//       }
//     }
//   }
// }

/**
 *  Show/hide animations for modals
 */
@keyframes fadeDockPopover {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(var(--size-32));
  }
}

@keyframes faceDockBackdrop {
  from {
    opacity: 0;
  }
}
</style>