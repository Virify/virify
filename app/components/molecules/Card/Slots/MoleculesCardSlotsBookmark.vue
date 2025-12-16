<template>
  <div class="m-card-slots-bookmark">
    <AtomsNoteButton :listing-id="propertyId" />
    <AtomsFavouriteButton :listing-id="propertyId" :confirm-removal="false" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  propertyId: number
}

defineProps<Props>()

</script>

<style lang="scss">
.m-card-slots-bookmark {
  position: absolute;
  top: var(--size-12);
  right: var(--size-12);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--size-8);
  padding: var(--size-8) var(--size-12);
  border-radius: var(--size-20);
  backdrop-filter: blur(8px);
  background: var(--card-bookmark-colour);
  color: var(--monochrome-900);

  .a-favourite-button,
  .a-note-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-28);
    height: var(--size-28);
    transition: opacity var(--animation-fast);
    
    svg {
      stroke: var(--monochrome-100);
    }

    :where(&):hover {
      opacity: 0.8;
    }
  }

  .a-note-button {
    --notes-active-color: currentColor;
  }

  .a-icon {
    width: var(--size-28);
    height: var(--size-28);
  }
}
</style>