<template>
  <div role="presentation" class="property-card-interactions">
    <button :disabled type="button" class="property-card-interactions__button" aria-label="Add to favourites">
      <AtomsIcon icon="cards/favourite" />
    </button>

    <button :disabled type="button" class="property-card-interactions__button" aria-label="Add note">
      <AtomsIcon icon="cards/notes" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
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
    color: var(--blue-500);
    margin: 0;
    border: 0;

    &:not([disabled]) {
      transition: color var(--animation-fast);
      color: light-dark(var(--monochrome-100), var(--monochrome-900));
      cursor: pointer;

      &:hover {
        color: var(--primary-500);
      }
    }
  }

  .a-icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>