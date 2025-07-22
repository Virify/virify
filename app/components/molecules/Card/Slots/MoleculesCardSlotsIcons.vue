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
  </ul>
</template>

<script setup lang="ts">
interface Props {
  roomCounts: {
    beds?: number | null
    baths?: number | null
    receptions?: number | null
  }
}

const props = defineProps<Props>()

/**
 *  Extract room counts
 */
const { beds, baths, receptions } = toRefs(props.roomCounts)

</script>

<style lang="scss">
.m-cards-slots-icons {
  list-style: none;
  padding: 0;
  margin: var(--size-8) 0;
  display: flex;
  align-items: center;
  gap: var(--size-24);

  &__row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
  }

  &__icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>