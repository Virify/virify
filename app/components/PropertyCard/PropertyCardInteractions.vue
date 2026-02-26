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
  background: var(--blue-300);
  color: var(--monochrome-900);
  padding: var(--size-4);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--size-6);
    margin: 0;
    background: var(--blue-300);
    border: 0;
    border-radius: var(--border-radius-lg);

    &:not([disabled]) {
      transition: background-color var(--animation-fast);
      color: currentColor;
      cursor: pointer;

      &:hover {
        background: var(--blue-500);
      }
    }

    .a-icon {
      width: var(--size-20);
      height: var(--size-20);
    }
  }
}
</style>