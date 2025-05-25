<template>
  <div class="o-listing-section-location | flow flow-lg">
    <h3 class="| title-sm">Map and location</h3>

    <div class="o-listing-section-location__grid" role="presentation">
      <ul role="presentation">
        <li>Nearest school - 2 miles</li>
        <li>Nearest hospital - 2 miles</li>
        <li>Nearest shops - 2 miles</li>
        <li>etc.</li>
      </ul>

      <OrganismsMap v-if="lat && lon" :lat :lon :zoom="15" :interactive="false"
        class="o-listing-section-location__map" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  lat: number
  lon: number
}

defineProps<Props>()
</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;

.o-listing-section-location {

  &__grid {
    display: grid;
    grid-gap: var(--size-16);

    @include mq.small-tablet {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__map {
    height: min(20em, 50vh);
  }
}
</style>