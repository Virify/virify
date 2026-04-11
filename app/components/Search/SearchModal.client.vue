<template>
  <div ref="root" popover :id="popoverId" class="search-modal" @toggle="toggleFocusTrap">
    <div class="search-modal__window" ref="modal-content">
      <div class="search-modal__content">
        <div class="search-modal__pseudo-background | elevate-300" ref="backdrop">
          <SearchSkeleton v-if="isSearchLoading" />
        </div>

        <SearchModalForm v-if="!isSearchLoading" @animate-to-dock="animateFormToDock" />
      </div>

      <button type="button" class="search-modal__backdrop" @click.prevent="hideModal" aria-hidden
        tabindex="-1"></button>

      <button v-if="!isSearchLoading" type="button" class="search-modal__close-button | button button-ghost button-sm"
        @click.prevent="hideModal">
        <AtomsIcon icon="arrow-left" />
        Close search
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

const { popoverId, showModal, hideModal } = useGlobalSearch()

/**
 *  Activate focus trap on open, close
 */
const $modalContent = useTemplateRef('modal-content')

const { activate, deactivate } = useFocusTrap($modalContent, {
  escapeDeactivates: false,
  initialFocus: () => {
    const { searchState } = useSearchState()

    // Get location from search state
    const { location } = asObject(searchState?.value)

    // If no location is selected, use default initial focus
    if (!location) return

    // Otherwise skip to the form type switcher
    const wrapper = $modalContent.value
    const selector = '.js-search-modal-initial-focus input:checked'
    const activeInput = wrapper?.querySelector(selector)

    // Return element
    return activeInput
  }
})

async function toggleFocusTrap(event: ToggleEvent) {
  const { newState } = asObject(event)

  if (newState === 'open') {
    activate()

    return
  }

  deactivate()
}

/**
 *  Animate to dock when search is triggered
 */
const isSearchLoading = ref(false)
const $backdrop = useTemplateRef('backdrop')

function runAnimation() {
  const backdropEl = $backdrop.value

  // If backdrop is not an element, something is wrong
  if (!isElement(backdropEl)) return

  // Set 'searching' to be 'true'
  isSearchLoading.value = true

  // Get starting width, height and position of backdrop
  const { width, height, bottom } = backdropEl.getBoundingClientRect()

  // Set backdrop position to be fixed, with appropriate width, height
  backdropEl.style.transition = 'none'
  backdropEl.style.inset = 'unset'
  backdropEl.style.position = 'fixed'
  backdropEl.style.bottom = (window.innerHeight - bottom) + 'px'
  backdropEl.style.left = '50%'
  backdropEl.style.transform = 'translateX(-50%)'
  backdropEl.style.width = width + 'px'
  backdropEl.style.height = height + 'px'

  // Get responsive sizes for final position
  const finalState = {
    width: '880px',
    height: '63px',
    bottom: '23px'
  }

  // Adjust final sizes based on screen size (hacky AF, but simplest way
  // to do this)
  const windowWidth = window.innerWidth

  if (windowWidth < 1280) {
    finalState.width = Math.min(800, windowWidth - 31) + 'px'
  }
  if (windowWidth < 1024) {
    finalState.bottom = '16px'
  }
  if (windowWidth < 768) {
    finalState.width = '450px'
    finalState.height = '86px'
    finalState.bottom = '10px'
  }
  if (windowWidth < 560) {
    finalState.width = windowWidth - 23 + 'px'
  }

  // Return promise for animation
  return new Promise(async (resolve, reject) => {
    const animation = await backdropEl.animate([finalState], {
      duration: 300,
      easing: 'cubic-bezier(0.2, 1.1, 0.8, 1)'
    })

    // When finished, resolve
    animation.onfinish = async () => {
      // Set animate state rather than use animationFillMode so that
      // we can easily reset the state for subsequent animations
      const { width, height, bottom } = asObject(finalState)

      backdropEl.style.bottom = bottom
      backdropEl.style.width = width
      backdropEl.style.height = height

      resolve(true)
    }

    // If cancelled, reject
    animation.oncancel = () => {
      reject(false)
    }
  })
}

function resetAnimation() {
  const backdropEl = $backdrop.value

  // If backdrop is not an element, something is wrong
  if (!isElement(backdropEl)) return

  // Clear any fixed styles
  backdropEl.style.transition = ''
  backdropEl.style.inset = ''
  backdropEl.style.position = ''
  backdropEl.style.bottom = ''
  backdropEl.style.left = ''
  backdropEl.style.transform = ''
  backdropEl.style.width = ''
  backdropEl.style.height = ''

  // Reset 'is searching'
  isSearchLoading.value = false
}

/**
 *  Perform the navigation, then hide and reset the dock
 */
async function animateFormToDock() {
  await runAnimation()
  await navigateTo('/search')

  window.scrollTo({
    top: 0,
    behavior: "instant"
  })

  hideModal()
  resetAnimation()
}

/**
 *  Universal search
 */
// @TODO - waiting list - remove once live
const { isWaitingListMode } = useWaitingListMode();
// @TODO end

function showUniversalSearch({ key, metaKey }: KeyboardEvent) {
  if (!metaKey || key !== 'k') return

  showModal()
}

onMounted(() => {
  // @TODO - waiting list - remove once live
  if (isWaitingListMode.value) return
  // @TODO end

  window.addEventListener('keydown', showUniversalSearch)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', showUniversalSearch)
})

/**
 *  Hide menu on scroll
 */
const $root = useTemplateRef('root')
const MAX_SCROLL = 300;

function updateBackdropOpacity() {
  if (!isElement($root.value)) return

  const scrollTop = $root.value.scrollTop || 0
  const scrollRel = Math.min(MAX_SCROLL, scrollTop) / MAX_SCROLL
  const scrollEase = Math.min(1.6 - (Math.pow(1 - scrollRel, 3)), 1) || 0

  $root.value.style.setProperty('--backdrop-opacity', String(scrollEase))
}

onMounted(async () => {
  await nextTick()

  $root.value?.addEventListener('scroll', updateBackdropOpacity, {
    passive: true
  })

  updateBackdropOpacity()
})

onBeforeUnmount(() => {
  $root.value?.removeEventListener('scroll', updateBackdropOpacity)
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.search-modal {
  --backdrop-opacity: 0;

  position: fixed;
  width: 100%;
  height: 100%;
  inset: 0;
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;

  // Use a button for additional backdrop to allow manually closing
  &__backdrop {
    cursor: pointer;
    position: fixed;
    inset: 0;
    right: 20px; // @TODO probably want to get this programmatically
    z-index: -1;
    background: var(--background-200);
    opacity: var(--backdrop-opacity);
  }

  &::backdrop {
    inset: 0;
    top: var(--header-height);
    background: var(--background-200);
    transition: opacity var(--animation-slow) var(--ease-in-out);

    @starting-style {
      opacity: 0;
    }
  }

  &__window {
    position: relative;
    width: min(calc(100% - var(--size-48)), 740px);
    margin: 144px auto var(--size-48);
    border: 0;
    padding: 0;
    background: none;
    overflow: visible;
    pointer-events: auto;

    @include mq.tablet {
      margin-top: 160px;
    }
  }

  &__close-button {
    position: absolute;
    bottom: calc(100% + var(--size-32));
    left: 0;
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
    color: currentColor;
    animation: fadeUp var(--animation-slow) var(--ease-in-out);
    animation-delay: var(--animation-slow);
    animation-fill-mode: both;

    &:hover {
      background: none;
      color: currentColor;
    }
  }

  &__content {
    position: relative;
    width: 100%;
    margin: 0 auto;
    z-index: 2;
  }

  &__pseudo-background {
    position: absolute;
    inset: 0;
    background: var(--background-100);
    border-radius: var(--border-radius-2xl);
    z-index: -1;
    transition: background-color, inset;
    transition-duration: var(--animation-subtle);
    transition-timing-function: var(--ease-in-out);
    transition-delay: var(--animation-fast);
    inset: calc(0px - var(--size-12));

    @include mq.tablet {
      border-radius: var(--border-radius-3xl);
      inset: calc(0px - var(--size-16));
    }

    @starting-style {
      background: transparent;
      inset: 0;
    }
  }
}
</style>