<template>
  <div class="m-card-slots-buttons">
    <MoleculesCardSlotsViewLink :property-id
      class="m-card-slots-buttons__button m-card-slots-buttons__button--view | button button-sm button-bordered button-full">
      View
    </MoleculesCardSlotsViewLink>

    <AtomsEnquireButton :listing-id="propertyId" :user-id="userId"
      class="m-card-slots-buttons__button m-card-slots-buttons__button--enquire | button button-sm button-full" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  userId: number
  propertyId: number
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-slots-buttons {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: var(--size-8);
  white-space: nowrap;

  &__button {
    border-radius: var(--border-radius-xl);
    box-sizing: border-box;

    &--view {
      border-color: var(--card-button-border-colour);
      border-width: 2px;

      &:hover {
        border-color: var(--card-button-border-colour);
      }
    }

    &--enquire {
      background-color: var(--card-button-background);
      color: var(--card-button-foreground);

      &:hover {
        background-color: var(--card-button-background-hover);
        color: var(--card-button-foreground-hover);
      }
    }
  }
}
</style>