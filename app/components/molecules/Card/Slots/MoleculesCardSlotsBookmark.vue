<template>
  <div class="m-card-slots-bookmark">
    <AtomsFavouriteButton :listing-id="propertyId" :confirm-removal="false" />
    <AtomsNoteButton :listing-id="propertyId" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  propertyId: number
}

defineProps<Props>()

</script>

<style lang="scss">
@use '#styles/_utils/functions' as fn;

.m-card-slots-bookmark {
  position: absolute;
  top: var(--size-14);
  right: var(--size-14);
  display: flex;
  flex-direction: column;
  gap: var(--size-6);
  color: #{ fn.faded-color(40%, var(--card-foreground)) };

  .a-favourite-button,
  .a-note-button {
    display: flex;
    align-items: center;
    transition: color var(--animation-fast);

    :where(&):hover {
      color: var(--card-foreground);
    }
  }

  .a-note-button {
    --notes-active-color: var(--card-foreground);
  }

  .a-icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>