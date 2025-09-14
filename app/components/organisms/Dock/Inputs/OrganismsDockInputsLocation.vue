<template>
  <button type="button" class="o-dock-inputs-location" :class="{
    'o-dock-inputs-location--no-radius': !radius,
    'o-dock-inputs-location--active': isExpanded
  }">
    <AtomsIcon class="o-dock-inputs-location__icon" icon="search/location" />

    <span role="presentation" class="o-dock-inputs-location__content">
      <span role="presentation" class="o-dock-inputs-location__text" v-if="locationName">
        {{ locationName }}
      </span>

      <span v-else class="o-dock-inputs-location__text">
        Add location
      </span>

      <span role="presentation" class="o-dock-inputs-location__radius" v-if="locationName && radius">
        +{{ radius }}
        <sup class="| body-2xs">Mi</sup>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
const { searchState } = useSearchState()

const locationName = computed(() => {
  const { place_name_en } = asObject(searchState.value?.location)

  return place_name_en
})

const radius = computed(() => {
  const { radius } = asObject(searchState.value)

  return radius
})

/**
 *  Is expanded styling
 */
interface Props {
  isExpanded?: boolean
}

defineProps<Props>()
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-inputs-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-10);
  background: var(--background-300);
  border-radius: var(--border-radius-2xl);
  padding: var(--size-6) var(--size-12);
  line-height: var(--size-24);
  font-size: var(--font-md);
  font-weight: var(--font-semibold);
  white-space: nowrap;
  flex: 1 0 auto;
  width: 100%;

  .a-icon {
    flex: 0 0 auto;
    width: var(--size-24);
    height: var(--size-24);
  }

  @include mq.tablet {
    font-size: var(--font-sm);

    &--active {
      background-color: var(--secondary-400);
      color: var(--monochrome-900);
    }
  }

  @include mq.mobile-only {
    &__icon {
      display: none;
    }

    &--no-radius &__icon {
      display: block;
    }

    &--no-radius &__content {
      display: none;
    }
  }

  &__content {
    display: flex;
    flex-shrink: 1;
    min-width: 0;
  }

  &__text {
    display: none;

    @include mq.tablet {
      display: unset;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 10ch;
      width: auto;
      flex-shrink: 1;
    }

    @include mq.desktop {
      max-width: 15ch;
    }
  }

  &__radius {

    sup {
      vertical-align: bottom;
      text-transform: uppercase;
    }
  }
}
</style>