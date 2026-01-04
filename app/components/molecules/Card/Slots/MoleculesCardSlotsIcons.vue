<template>
  <ul class="m-cards-slots-icons | body-lg font-semibold">
    <li v-if="beds" class="m-cards-slots-icons__row">
      <AtomsIcon icon="property/bedrooms" title="Bedroom count" class="m-cards-slots-icons__icon | faded-text" />
      {{ beds }}
    </li>
    <li v-if="baths" class="m-cards-slots-icons__row">
      <AtomsIcon icon="property/bathrooms" title="Bathroom count" class="m-cards-slots-icons__icon | faded-text" />
      {{ baths }}
    </li>
    <li v-if="receptions" class="m-cards-slots-icons__row">
      <AtomsIcon icon="property/receptions" title="Receptions count" class="m-cards-slots-icons__icon | faded-text" />
      {{ receptions }}
    </li>
    <li v-if="hasOutdoorSpace" class="m-cards-slots-icons__row">
      <AtomsIcon icon="property/rear-garden" title="Outdoor space" class="m-cards-slots-icons__icon | faded-text" />
    </li>
    <li v-if="parkingType === 'garage'" class="m-cards-slots-icons__row">
      <AtomsIcon icon="property/garage" title="Garage" class="m-cards-slots-icons__icon | faded-text" />
    </li>
    <li v-else-if="parkingType === 'parking'" class="m-cards-slots-icons__row">
      <AtomsIcon icon="property/parking" title="Parking" class="m-cards-slots-icons__icon | faded-text" />
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Props {
  roomCounts: {
    beds?: number | null
    baths?: number | null
    receptions?: number | null
  }
  hasOutdoorSpace?: boolean
  parkingType?: 'garage' | 'parking' | null
}

const props = defineProps<Props>()

/**
 *  Extract room counts
 */
const { beds, baths, receptions } = asObject(props.roomCounts)

</script>

<style lang="scss">
.m-cards-slots-icons {
  list-style: none;
  padding: 0;
  margin: var(--size-8) 0;
  display: flex;
  align-items: center;
  gap: var(--size-12);

  &__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-6);
  }

  &__icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>