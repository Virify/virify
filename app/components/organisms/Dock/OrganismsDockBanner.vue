<template>
  <section class="o-dock-banner__form-height" role="presentation">
    <div ref="$focusWrapper" tabindex="-1" class="o-dock-banner | flow" @focusin="showExpandedForm">
      <div class="o-dock-banner__backdrop | elevate-300" :class="{
        'o-dock-banner__backdrop--hidden': !hasLocation
      }" aria-hidden="true"></div>

      <MoleculesAiSearchFormLocation class="o-dock-banner__fader" />

      <client-only>
        <Transition v-show="hasLocation && isExpanded" name="o-dock-banner">
          <MoleculesAiSearchFormFilters class="o-dock-banner__fader" :initial-query :disabled="!hasLocation" hideReset
            @submit-search="searchSubmit" @reset-search="searchReset" />
        </Transition>
      </client-only>

      <AtomsButton v-if="hasLocation && !isExpanded"
        class="o-dock-banner__toggle o-dock-banner__fader | button-bordered button-full button-xs" type="button"
        @click.prevent="showExpandedForm">
        Expand form
      </AtomsButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const initialQuery = ref('')

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

async function searchSubmit(query: string) {
  setQuery(query)

  await navigateTo({
    path: '/dock'
  })
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

  &__backdrop {
    position: absolute;
    z-index: -1;
    inset: calc(0px - var(--size-12));
    background: var(--background-200);
    border-radius: var(--border-radius-2xl);
    transition: box-shadow, inset, opacity;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);

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

  &__toggle {
    margin-top: var(--size-16);

    &--expanded {
      margin-top: var(--size-36);

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