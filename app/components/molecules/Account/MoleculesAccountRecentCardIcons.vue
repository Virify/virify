<template>
  <div class="recent-card-icons">
    <button v-if="showFavouriteIcon" class="recent-card-icons__action recent-card-icons__action--favourite" :title="getFavouriteTitle" @click.prevent="$emit('toggleFavourite')">
      <AtomsIcon :icon="getFavouriteIcon" size="24" />
    </button>

    <button v-if="showNotesIcon" class="recent-card-icons__action recent-card-icons__action--notes" title="Edit note" @click.prevent="$emit('editNote')">
      <AtomsIcon icon="cards/notes" size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isFavourite?: boolean;
  showFavouriteIcon?: boolean;
  showNotesIcon?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  toggleFavourite: [];
  editNote: [];
}>();

const getFavouriteIcon = computed(() => (props.isFavourite ? "cards/favourite-filled" : "cards/favourite"));

const getFavouriteTitle = computed(() => (props.isFavourite ? "Remove from favourites" : "Add to favourites"));
</script>

<style lang="scss" scoped>
.recent-card-icons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--size-8);
  flex-shrink: 0;

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: var(--size-4);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--background-200);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }

    &--favourite {
      color: var(--secondary-500);
    }

    &--notes {
      color: var(--blue-500);
    }
  }
}
</style>
