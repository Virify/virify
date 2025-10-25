<template>
  <section class="o-dock-banner__form-height" role="presentation">
    <div ref="$focusWrapper" tabindex="-1" class="o-dock-banner" @focusin="showExpandedForm">
      <div class="o-dock-banner__backdrop | elevate-300" :class="{
        'o-dock-banner__backdrop--hidden': !hasLocation
      }" aria-hidden="true" ref="$backdrop">
        <OrganismsDockMenuSkeleton v-if="isSearchLoading" class="o-dock-banner__backdrop-skeleton" />
      </div>

      <fieldset class="o-dock-banner__fader | flow flow-lg" :disabled="isSearchLoading">
        <MoleculesAiSearchFormLocation />

        <client-only>
          <Transition v-show="hasLocation && isExpanded" name="o-dock-banner">

            <OrganismsFilterSwitcher>
              <template v-slot:traditional>
                <OrganismsTraditionalSearchForm class="o-dock-banner__toggle-content" />
              </template>

              <template v-slot:ai>
                <MoleculesAiSearchFormFilters :initial-query :disabled="!hasLocation" hideReset
                  @submit-search="searchSubmit" @reset-search="searchReset" class="o-dock-banner__toggle-content" />
              </template>
            </OrganismsFilterSwitcher>
          </Transition>
        </client-only>

        <AtomsButton v-if="hasLocation && !isExpanded"
          class="o-dock-banner__toggle | button-bordered button-full button-xs" type="button"
          @click.prevent="showExpandedForm">
          Expand form
        </AtomsButton>
      </fieldset>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

/**
 *  Animate dock to final position
 */
const isSearchLoading = ref(false)
const $backdrop = useTemplateRef('$backdrop')

async function animateFormToDock() {
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
  const finalAnimationState = {
    width: '880px',
    height: '63px',
    bottom: '23px'
  }

  // Adjust final sizes based on screen size (hacky AF, but simplest way
  // to do this)
  const windowWidth = window.innerWidth

  if (windowWidth < 1280) {
    finalAnimationState.width = Math.min(800, windowWidth - 31) + 'px'
  }
  if (windowWidth < 1024) {
    finalAnimationState.bottom = '16px'
  }
  if (windowWidth < 768) {
    finalAnimationState.width = '450px'
    finalAnimationState.height = '86px'
    finalAnimationState.bottom = '10px'
  }
  if (windowWidth < 560) {
    finalAnimationState.width = windowWidth - 23 + 'px'
  }

  // Return promise for animation
  return new Promise(async (resolve, reject) => {
    const animation = await backdropEl.animate([finalAnimationState], {
      duration: 300,
      easing: 'cubic-bezier(0.2, 1.1, 0.8, 1)',
      fill: 'forwards'
    })

    // When finished, resolve
    animation.onfinish = () => {
      resolve(true)
    }

    // If cancelled, reject
    animation.oncancel = () => {
      reject(false)
    }
  })
}

/**
 *  Toggle filters as visible
 */
const isExpanded = ref(true)

function showExpandedForm() {
  isExpanded.value = true
}

/**
 *  Close form on click outside
 */
const $formWrapper = useTemplateRef('$focusWrapper')

onClickOutside($formWrapper, () => {
  isExpanded.value = false
})

/**
 *  Fetch filters
 */
const { setQuery, searchState } = useSearchState()

const initialQuery = computed(() => {
  const { query } = asObject(searchState.value)

  return query
})

async function searchSubmit(query: string) {
  setQuery(query)

  await animateFormToDock()
  await navigateTo({
    path: '/search'
  })

  /**
   *  To avoid global smooth scrolling
   *
   *  @TODO - we may want to have a more site-wide and elevant fix for
   *          this, perhaps finding a way to adjust the Vue Router
   *          behaviour to have `behaviour: instant` instead
   *          https://router.vuejs.org/guide/advanced/scroll-behavior
   */
  window.scrollTo({
    top: 0,
    behavior: "instant"
  });
};

function searchReset() {
  setQuery('')
}

/**
 *  Disable filters button if no location is added
 */
const hasLocation = computed(() => {
  const { location } = asObject(searchState.value)

  return !!location
})
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-banner {
  position: relative;
  z-index: 2;
  text-align: left;

  &__form-height {
    height: 7em;
    overflow: visible;

    @include mq.tablet {
      height: 5em;
    }
  }

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    z-index: -1;
    pointer-events: none;
    transition: background-color var(--animation-slow);
  }

  &:hover::before {
    background: rgba(0, 0, 0, 0.4);
  }

  &__backdrop {
    position: absolute;
    z-index: -1;
    inset: calc(0px - var(--size-12));
    background: var(--background-200);
    border-radius: var(--border-radius-2xl);
    transition: box-shadow, inset, opacity;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);
    overflow: hidden;

    @include mq.tablet {
      border-radius: var(--border-radius-3xl);
      inset: calc(0px - var(--size-16));
    }

    &--hidden {
      box-shadow: none;
      opacity: 0;
      inset: 0;
    }
  }

  &__backdrop-skeleton {
    padding: var(--size-12);
    height: 100%;
    box-sizing: border-box;
  }

  &__fader {
    min-width: 0;
    transition: opacity var(--animation-medium) var(--ease-out);

    &[disabled] {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__toggle {
    margin-top: var(--size-16);

    &--expanded {
      margin-top: var(--size-36);
    }
  }

  &__toggle-content {
    padding: 0 var(--size-6) var(--size-6);

    @include mq.small-tablet {
      padding: 0 var(--size-16) var(--size-16);
    }
  }
}

/**
 *  Toggle transitions
 */
.o-dock-banner-enter-active,
.o-dock-banner-leave-active {
  interpolate-size: allow-keywords;

  height: calc-size(max-content, size);
  transition: height, margin;
  transition-duration: var(--animation-slow);
  transition-timing-function: var(--ease-out);
  overflow: hidden;
}

.o-dock-banner-leave-to,
.o-dock-banner-enter-from {
  margin: 0;
  height: 0;
}
</style>