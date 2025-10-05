<template>
  <div class="o-dock" :class="{
    'o-dock--open': !!popover
  }" role="presentation">
    <div ref="$popover" popover="auto" class="o-dock__popover-container" role="presentation">
      <div :id="popoverId" class="o-dock__popover | elevate-200" tabindex="-1">
        <AtomsButton class="o-dock__popover-close | button button-quiet" aria-label="Close popover"
          :aria-controls="popoverId" @click.prevent="hidePopover">
          <AtomsIcon icon="cross" aria-hidden class="o-dock__popover-close-icon" />
        </AtomsButton>

        <template v-if="popover">
          <component :is="popover.component" />

          <OrganismsDockViewsFooter :popover-id="popoverId" :currently-open="popover?.type" @open-popover="showPopover"
            @close-popover="hidePopover" />
        </template>
      </div>
    </div>

    <OrganismsDockMenu :popover-id="popoverId" :currently-open="popover?.type" @open-popover="showPopover"
      class="o-dock__menu | elevate-300" />
  </div>
</template>

<script setup lang="ts">
import { OrganismsDockViewsLocation, OrganismsDockViewsFilters } from '#components'

export type PopoverType = 'location' | 'filters'
export type PopoverEmits = {
  (e: 'open-popover', value: PopoverType): void
}

interface Popover {
  type: PopoverType
  component: Component
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

function getValidPopoverType(type: PopoverType): boolean {
  const validTypes: PopoverType[] = ['filters', 'location']

  return validTypes.includes(type)
}

function getValidPopoverComponent(type: PopoverType): Component {
  if (type === 'filters') {
    return OrganismsDockViewsFilters
  }

  return OrganismsDockViewsLocation
}

function showPopover(type: PopoverType) {
  if (!getValidPopoverType(type)) return

  const component = getValidPopoverComponent(type)

  popover.value = {
    type,
    component
  }

  $popover.value?.showPopover()
  $popover.value?.focus()
}

function hidePopover() {
  $popover.value?.hidePopover()
}

/**
 *  Close popover when results are updated
 */
const { searchState } = useSearchState()
const results = computed(() => asObject(searchState.value).results)

watch(results, () => {
  hidePopover()
})

/**
 *  Monitor close events
 */
onMounted(() => {
  $popover.value?.addEventListener('toggle', (event: Event) => {
    const { newState } = asObject(event as ToggleEvent)

    if (newState !== 'closed') return

    popover.value = null
  })
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock {
  $dock-height: 80px;

  list-style: none;
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: var(--size-10);
  z-index: 9;

  @include mq.tablet {
    bottom: var(--size-16);
  }

  @include mq.notebook {
    bottom: var(--size-24);
  }

  &__popover-container {
    position: fixed;
    left: 0;
    right: 0;
    top: auto;
    bottom: var(--size-10);
    align-items: center;
    justify-content: center;
    width: 100%;
    background: none;
    overflow: hidden;
    pointer-events: none;

    &:popover-open {
      display: flex;
    }

    @include mq.tablet {
      bottom: calc(var(--size-16) + #{ $dock-height });
    }

    @include mq.notebook {
      bottom: calc(var(--size-24) + #{ $dock-height });
    }
  }

  &__popover {
    position: relative;
    max-height: calc(100dvh - var(--size-24));
    padding: var(--size-16);
    padding-top: var(--size-48);
    margin: 0;
    z-index: 10;
    overflow: auto;
    scrollbar-width: thin;
    pointer-events: all;
    overscroll-behavior: contain;

    @include mq.tablet {
      max-height: calc(100dvh - var(--size-32) - #{ $dock-height });
      padding: var(--size-32);
    }

    @include mq.notebook {
      max-height: calc(100dvh - var(--size-48) - #{ $dock-height });
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

  &__popover,
  &__menu {
    background: var(--background-200);
    border-radius: var(--border-radius-3xl);
    border: 1px solid var(--border-color-200);
    box-sizing: border-box;
    width: calc(100% - var(--size-24));

    @include mq.small-tablet {
      width: min(100% - var(--size-32), 450px);
    }

    @include mq.tablet {
      width: min(100% - var(--size-32), 800px);
    }

    @include mq.desktop {
      width: min(100% - var(--size-32), 880px);
    }
  }
}

/**
 *  Offset transitions on mobile
 *
 */
@include mq.motion {
  .o-dock__menu {
    transition-property: opacity, transform;
    transition-duration: var(--animation-fast);
    transition-timing-function: var(--ease-in);
  }

  .o-dock {

    &__popover {
      animation: fadeDockPopover var(--animation-medium) var(--ease-out);
    }

    /*
       *  @TODO
       *  There is a bug in Safari where `:popover-open` is always true,
       *  meaning the popover opacity never gets removed. Temporarily
       *  using explicit `&--open` classname
       */
    &--open &__popover {
      display: block;
      animation-delay: var(--animation-fast);
      animation-fill-mode: backwards;

      @include mq.tablet {
        animation-delay: 0ms;
      }
    }

    &--open .o-dock__menu {
      opacity: 0;
      transform: translateY(var(--size-8));

      @include mq.tablet {
        opacity: unset;
        transform: none;
      }
    }
  }

  @keyframes fadeDockPopover {
    from {
      opacity: 0;
      transform: translateY(var(--size-32));
    }
  }

  @keyframes faceDockBackdrop {
    from {
      opacity: 0;
    }
  }
}
</style>