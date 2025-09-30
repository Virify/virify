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
  top: var(--size-12);
  right: var(--size-12);
  display: flex;
  flex-direction: column;
  color: var(--card-foreground);
  border: 1px solid #{ fn.faded-color(20%, var(--card-foreground)) };
  border-radius: var(--border-radius-2xl);
  padding: var(--size-4);
  gap: var(--size-2);

  .a-favourite-button,
  .a-note-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-24);
    height: var(--size-24);
    transition: color var(--animation-fast);
    padding: var(--size-6);
    border-radius: var(--border-radius-2xl);
    box-sizing: content-box;
    transition: background-color var(--animation-fast);

    :where(&):hover {
      color: var(--card-foreground);
      background: #{ fn.faded-color(10%, var(--card-foreground)) };
    }
  }

  .a-note-button {
    --notes-active-color: var(--card-foreground);
    --notes-active-background: #{ fn.faded-color(25%, var(--secondary-400)) };
  }

  .a-icon {
    width: var(--size-24);
    height: var(--size-24);
  }
}
</style>