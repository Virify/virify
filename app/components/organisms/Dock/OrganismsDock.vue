<template>
  <div class="o-dock">
    <div ref="$popover" popover="auto" :id="popoverId" class="o-dock__popover o-dock-container | elevate-200" :class="{
      'o-dock__popover--open': !!popover
    }" tabindex="-1">
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

    <OrganismsDockMenu :popover-id="popoverId" :currently-open="popover?.type" @open-popover="showPopover"
      class="o-dock__menu o-dock-container | elevate-300" />
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
  border: 1px solid var(--border-color-200);

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

  &__popover {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    top: auto;
    bottom: var(--size-10);
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

  .o-dock__popover {
    animation: fadeDockPopover var(--animation-medium) var(--ease-out);

    /*
       *  @TODO
       *  There is a bug in Safari where `:popover-open` is always true,
       *  meaning the popover opacity never gets removed. Temporarily
       *  using explicit `&--open` classname
       */
    &--open {
      display: block;
      animation-delay: var(--animation-fast);
      animation-fill-mode: backwards;

      @include mq.tablet {
        animation-delay: 0ms;
      }
    }

    &--open+.o-dock__menu {
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
      transform: translateX(-50%) translateY(var(--size-32));
    }
  }

  @keyframes faceDockBackdrop {
    from {
      opacity: 0;
    }
  }
}
</style>