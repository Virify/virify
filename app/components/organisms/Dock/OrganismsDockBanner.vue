<template>
  <div class="o-dock-banner">
    <div class="o-dock-banner__content | flow flow-xl">
      <h1 class="| title-xl">Find your perfect property</h1>

      <section class="o-dock-banner__form-height" role="presentation">
        <div ref="$focusWrapper" tabindex="-1" class="o-dock-banner__form | flow">
          <div class="o-dock-banner__form-backdrop | elevate-300" :class="{
            'o-dock-banner__form-backdrop--hidden': !hasLocation
          }" aria-hidden="true"></div>

          <MoleculesAiSearchFormLocation class="o-dock-banner__form-fader" />

          <client-only>
            <Transition v-show="hasLocation && filtersVisible" name="o-dock-banner">
              <MoleculesAiSearchFormFilters class="o-dock-banner__form-fader" :initial-query :disabled="!hasLocation"
                hideReset @submit-search="searchSubmit" @reset-search="searchReset" />
            </Transition>
          </client-only>

          <AtomsButton v-if="hasLocation" class="o-dock-banner__toggle | button-bordered button-full button-xs" :class="{
            'o-dock-banner__toggle--expanded': filtersVisible
          }" type="button" @click.prevent="toggleFiltersVisibility">
            {{ filtersVisible ? 'Collapse' : 'Show' }} additional fields
          </AtomsButton>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const initialQuery = ref('')

/**
 *  @TODO
 *  When a user selects a location
 *    OR
 *  Focuses within the container
 *    -> SHOW FILTERS
 * 
 *  When a user clicks outside of the container
 *    OR
 *  When a user presses 'escape' key
 *    OR
 *  When user clicked a 'close' button? (TBC)
 *    -> HIDE FILTERS
 *    -> SHOW EXPAND FILTERS BUTTON
 * 
 *  When a user opens the location autocomplete
 *    AND
 *  WHen 'expand filters button' is visible
 *    -> HIDE EXPAND FILTERS BUTTON
 */

/**
 *  Toggle filters as visible
 */
const filtersVisible = ref(true)

function toggleFiltersVisibility() {
  filtersVisible.value = !filtersVisible.value
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  padding: var(--size-64) var(--size-32);
  box-sizing: border-box;
  background: #27da9b;
  text-align: center;

  &__content {
    max-width: min(100%, 45rem);
    margin: 0 auto;
    flex: 1 0;
  }

  &__form {
    position: relative;
    z-index: 2;
    text-align: left;
  }

  &__form-height {
    height: 7em;
    overflow: visible;

    @include mq.tablet {
      height: 5em;
    }
  }

  &__form-backdrop {
    position: absolute;
    z-index: -1;
    inset: calc(0px - var(--size-12));
    background: var(--background-200);
    border-radius: var(--border-radius-3xl);
    transition: box-shadow, inset, opacity;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-in-out);

    @include mq.tablet {
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