<template>
  <section class="o-dock-banner | flow flow-lg">
    <div class="o-dock-banner__form-height" role="presentation">
      <MoleculesAiSearchFormLocation class="o-dock-banner__form" @location-selected="showModal" />
    </div>

    <AtomsButton v-if="hasLocation && !isExpanded" class="o-dock-banner__toggle | button-full button-xs" type="button"
      @click.prevent="showModal">
      Expand form
    </AtomsButton>
  </section>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Props {
  listingType?: ListingType;
}

const props = withDefaults(defineProps<Props>(), {
  listingType: 'all'
});

/**
 *  Show modal
 */
const { showModal } = useGlobalSearch()

/**
 *  Toggle filters as visible
 */
const isExpanded = shallowRef(false)

/**
 *  Fetch filters
 */
const { searchState } = useSearchState()

/**
 *  Disable filters button if no location is added - to avoid hydration
 *  mismatch, server never has a location
 *
 */
const hasLocation = computed(() => {
  const { location } = asObject(searchState.value)

  return import.meta.client && !!location
})

/**
 *  Close form on click outside
 */
const $dock = useTemplateRef('$dock')

onClickOutside($dock, () => (
  isExpanded.value = false
))

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-banner {
  position: relative;

  &__form-height {
    height: 7em;
    overflow: visible;

    @include mq.tablet {
      height: 5em;
    }
  }

  &__form {
    position: relative;
    z-index: 2;
  }

  &__toggle {
    position: absolute;
    top: calc(100% + var(--size-16));
    left: 0;
    margin: 0;
    color: var(--foreground-100);
    background-color: var(--background-100);
    transition: background-color var(--animation-fast) var(--ease-in-out);

    &:hover {
      background-color: var(--background-300);
    }

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

  &__toggle-content-loader {
    --tab-height-offset: 3.6rem;
    min-height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: var(--size-24);

    .a-icon {
      width: var(--size-40);
      height: var(--size-40);
    }

    &--dark {
      border-radius: var(--border-radius-2xl);
      margin: var(--tab-height-offset) var(--size-6) var(--size-6);

      @include mq.small-tablet {
        margin: var(--tab-height-offset) var(--size-16) var(--size-16);
      }

      /**
       *  @TODO This is currently duplicated from the component:
       *        OrganismsTraditionalSearchContract - we should probably
       *        create a global utility class so this can be 'shared'
       */
      background: linear-gradient(to bottom, var(--blue-400), var(--blue-300));
      color: var(--monochrome-900);
    }
  }
}
</style>