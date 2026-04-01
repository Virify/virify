<template>
  <div popover ref="modal" id="universal-search" class="search-modal">
    <button type="button" class="search-modal__backdrop" @click.prevent="hideModal" aria-label="Close popover"></button>

    <button v-if="!isSearchLoading" type="button" class="search-modal__close-button | button button-ghost button-sm"
      @click.prevent="hideModal">
      <AtomsIcon icon="arrow-left" />
      Close search
    </button>

    <div class="search-modal__content">
      <div class="search-modal__pseudo-background | elevate-300" ref="backdrop">
        <SearchSkeleton v-if="isSearchLoading" />
      </div>

      <SearchModalForm v-if="!isSearchLoading" @animate-to-dock="animateFormToDock" />
    </div>
  </div>
</template>

<script setup lang="ts">
const $modal = useTemplateRef('modal')

function showModal() {
  $modal.value?.showPopover()
}

function hideModal() {
  $modal.value?.hidePopover()
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
function showUniversalSearch({ key, metaKey }: KeyboardEvent) {
  if (!metaKey || key !== 'k') return

  showModal()
}

onMounted(() => {
  window.addEventListener('keydown', showUniversalSearch)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', showUniversalSearch)
})

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.search-modal {
  width: min(calc(100% - var(--size-48)), 740px);
  margin: 140px auto var(--size-32);
  border: 0;
  padding: 0;
  background: none;
  overflow: visible;

  @include mq.tablet {
    margin: 160px auto var(--size-32);
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
    animation-delay: var(--animation-fast);
    animation-fill-mode: both;

    &:hover {
      background: none;
      color: currentColor;
    }
  }

  &__content {
    position: relative;
  }

  &__pseudo-background {
    position: absolute;
    inset: 0;
    background: var(--background-100);
    border-radius: var(--border-radius-2xl);
    z-index: -1;
    transition: background-color, inset;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);
    inset: calc(0px - var(--size-16));

    @include mq.tablet {
      border-radius: var(--border-radius-3xl);
    }

    @starting-style {
      background: transparent;
      inset: 0;
    }
  }

  // Do not use native backdrop because we want to prevent content
  // behind the backdrop being clickable
  &::backdrop {
    display: none;
  }

  &__backdrop {
    cursor: pointer;
    position: fixed;
    inset: 0;
    top: 60px;
    background: var(--background-200);
    transition: opacity var(--animation-slow) var(--ease-in-out);
    z-index: -1;

    @starting-style {
      opacity: 0;
    }

    // @TODO probably want to align these with the header
    @include mq.tablet {
      top: 64px;
    }

    @include mq.notebook {
      top: 68px;
    }

    @media (min-height: 940px) {
      top: 78px;
    }
  }
}
</style>