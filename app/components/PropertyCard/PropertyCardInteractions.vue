<template>
  <div role="presentation" class="property-card-interactions">
    <AtomsFavouriteButton :disabled :listing-id :confirm-removal="false" class="property-card-interactions__button" />
    <AtomsNoteButton :disabled :listing-id class="property-card-interactions__button" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  listingId: number,
  disabled?: boolean
}

defineProps<Props>()

</script>

<style lang="scss">
.property-card-interactions {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--size-6);
  gap: var(--size-8);

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border: 0;

    &[disabled] {
      color: var(--blue-500);
      pointer-events: none;
    }

    &:not([disabled]) {
      transition: color var(--animation-fast);
      cursor: pointer;
    }
  }

  .a-icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>