<template>
  <ul class="o-dock-menu">
    <li class="o-dock-menu__item">
      <span class="o-dock-menu__mobile-label | faded-text body-xs">Results layout</span>

      <OrganismsDockInputsLayout class="o-dock-menu__fix-height" />
    </li>

    <li class="o-dock-menu__item o-dock-menu__item--shrinkable">
      <span class="o-dock-menu__mobile-label | faded-text body-xs">Sort by</span>

      <OrganismsDockInputsSort class="o-dock-menu__fix-height" />
    </li>

    <li class="o-dock-menu__item o-dock-menu__item--shrinkable">
      <span class="o-dock-menu__mobile-label | faded-text body-xs">Location</span>

      <OrganismsDockInputsLocation class="o-dock-menu__fix-height" :popovertarget="popoverId"
        :is-expanded="currentlyOpen === 'location'" @click.prevent="showLocationDialog" />
    </li>

    <li class="o-dock-menu__item o-dock-menu__item--fit-content">
      <span class="o-dock-menu__mobile-label | faded-text body-xs">Filters</span>

      <OrganismsDockInputsFilters class="o-dock-menu__fix-height" :popovertarget="popoverId"
        :is-expanded="currentlyOpen === 'filters'" @click.prevent="showFiltersDialog" :disabled="!hasLocation">
      </OrganismsDockInputsFilters>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PopoverType, PopoverEmits } from './OrganismsDock.vue'

/**
 *  Props
 */
interface Props {
  popoverId?: string
  currentlyOpen?: PopoverType
}

defineProps<Props>()

/**
 *  Open popover
 */
const emits = defineEmits<PopoverEmits>()

function showLocationDialog() {
  emits('open-popover', 'location')
}

function showFiltersDialog() {
  emits('open-popover', 'filters')
}

/**
 *  Check if a location has been added
 */
const { state } = useUniversalSearch()

const hasLocation = computed(() => {
  const { location } = asObject(state.value)

  return (location as Record<string, unknown>)?.place_name_en
})

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-menu {
  padding: var(--size-8);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--size-8);
  justify-content: stretch;

  @include mq.tablet {
    padding: var(--size-12);
  }

  &__item {
    display: flex;
    flex-direction: column;
    text-align: center;
    justify-content: stretch;
    gap: var(--size-6);
    flex: 1 1 auto;

    &--shrinkable {
      min-width: 4ch;
    }

    &--fit-content {
      flex: 0 0 fit-content;
    }
  }

  &__mobile-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include mq.tablet {
      display: none;
    }
  }

  &__fix-height {
    height: var(--size-48);
    padding-top: 0;
    padding-bottom: 0;

    @include mq.tablet {
      height: var(--size-40);
    }
  }
}
</style>