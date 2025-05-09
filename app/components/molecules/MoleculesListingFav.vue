<template>
  <div>
    <button
    class="| button button-secondary button-xs"
    @click="toggle(isCurrentFavourite ? 'remove' : 'add')"
    aria-label="Toggle favourite"
  >
    <Icon
      :name="isCurrentFavourite ? 'iconoir:trash' : 'material-symbols:kid-star-outline-sharp'"
      class="icon"
    />
  </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  listingId: {
    type: Number,
    required: true,
  },
});

const { isFavourite, addToFavourite, removeFromFavourite } = useFavourites();

const isCurrentFavourite = computed(() => {
  return isFavourite(props.listingId);
});

const toggle = async (action: 'add' | 'remove') => {
  if (action === 'add') {
    await addToFavourite(props.listingId);
  } else {
    await removeFromFavourite(props.listingId);
  }
};
</script>
<style lang="scss" scoped>
@use '#styles/_utils/functions' as fn;
.icon {
  height: var(--size-24);
  width: var(--size-24);
  z-index: 0;
}
</style>
