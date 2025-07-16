<template>
  <button type="button" class="o-dock-inputs-location" :class="{
    'o-dock-inputs-location--no-radius': !locationRadius
  }">
    <AtomsIcon class="o-dock-inputs-location__icon" icon="search/location" />

    <span role="presentation" class="o-dock-inputs-location__content">
      <span role="presentation" class="o-dock-inputs-location__text" v-if="location">
        {{ location.place_name_en }}
      </span>

      <span role="presentation" class="o-dock-inputs-location__radius" v-if="locationRadius">
        +{{ locationRadius }}
        <sup class="| body-2xs">Mi</sup>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
const { state } = useUniversalSearch()

const { location, locationRadius } = toRefs(state.value)
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-dock-inputs-location {

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