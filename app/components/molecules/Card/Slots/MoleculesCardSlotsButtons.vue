<template>
  <div class="m-card-slots-buttons">
    <MoleculesCardSlotsViewLink :property-id
      class="m-card-slots-buttons__button m-card-slots-buttons__button--view | button button-sm button-bordered button-full">
      View
    </MoleculesCardSlotsViewLink>

    <AtomsButton class="m-card-slots-buttons__button m-card-slots-buttons__button--enquire | button-sm button-full">
      Enquire
    </AtomsButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
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
    border-radius: var(--border-radius-ui);
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