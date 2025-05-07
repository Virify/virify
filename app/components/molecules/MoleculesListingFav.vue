<template>
  <div>
    <button
    class="| button button-secondary button-xs"
    @click="toggle(currentFavourite ? 'remove' : 'add')"
    aria-label="Toggle favourite"
  >
    <Icon
      :name="currentFavourite ? 'iconoir:trash' : 'material-symbols:kid-star-outline-sharp'"
      class="icon"
    />
  </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  userFavourites: {
    type: Array as PropType<number[]>,
  },
  listingId: {
    type: Number,
    required: true,
  },
});

const { isFavourite } = useFavourites();

const currentFavourite = computed(() => {
  return isFavourite(props.listingId, props.userFavourites || []);
});

const emit = defineEmits<{
  (event: 'toggle', listingId: number, action: 'add' | 'remove'): void;
}>();

const toggle = (action: 'add' | 'remove') => {
  emit('toggle', props.listingId, action);
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
