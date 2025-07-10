<template>
  <div ref="emblaNode" class="m-listing-card-image-container">
    <div class="m-listing-card-image-slides">
      <div v-for="(img, index) in images" :key="index" class="m-listing-card-image-slide">
        <nuxt-img :src="img" alt="Listing image" class="m-listing-card-image" />
      </div>
    </div>
    <div class="m-listing-card-image-overlay">
      <div class="m-listing-card-image-counter | body-xs">
        {{ selectedIndex + 1 }}/{{ images.length }}
      </div>
      <div class="m-listing-card-image-actions">
        <button 
          class="m-listing-card-icon-button" 
          :class="{ 'is-active': isFavourite(listingId) }"
          @click="toggleFavourite(listingId)"
        >
          <AtomsIcon name="heart" icon="cards/favourite" class="icon-heart" />
        </button>
        <button 
          class="m-listing-card-icon-button" 
          :class="{ 'is-active': hasNote(listingId) }"
          @click="showNoteDialog(listingId)"
        >
          <AtomsIcon name="edit" icon="cards/notes" class="icon-edit" />
        </button>
      </div>
      <button class="m-listing-card-arrow-button m-listing-card-arrow-button--left" @click="scrollPrev">
        <AtomsIcon name="chevron-left" icon="chevron-left" />
      </button>
      <button class="m-listing-card-arrow-button m-listing-card-arrow-button--right" @click="scrollNext">
        <AtomsIcon name="chevron-right" icon="chevron-right" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import emblaCarouselVue from 'embla-carousel-vue'
import { useFavourites } from '~/composables/useFavourites';
import { useNotes } from '~/composables/useNotes';

const props = defineProps({
  images: {
    type: Array as () => string[],
    required: true,
  },
  listingId: {
    type: Number,
    required: true,
  }
})

const { isFavourite, toggleFavourite } = useFavourites();
const { showNoteDialog, hasNote } = useNotes();

const [emblaNode, emblaApi] = emblaCarouselVue({ loop: true, startIndex: 0 })
const selectedIndex = ref(0)

const scrollPrev = () => {
  emblaApi.value?.scrollPrev()
}

const scrollNext = () => {
  emblaApi.value?.scrollNext()
}

const onSelect = () => {
  if (!emblaApi.value) return
  selectedIndex.value = emblaApi.value.selectedScrollSnap()
}

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on('select', onSelect)
    onSelect()
  }
})
</script>

<style lang="scss">
.m-listing-card-image-container {
  border-radius: var(--border-radius-2xl);
  overflow: hidden;
  position: relative;
  width: var(--image-width);
  z-index: 1;

  &:hover .m-listing-card-arrow-button {
    opacity: 1;
  }
}

.m-listing-card-image-slides {
  display: flex;
  height: 100%;
}

.m-listing-card-image-slide {
  flex: 0 0 100%;
  min-width: 0;
  position: relative;
}

.m-listing-card-image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.m-listing-card-image-overlay {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;

  >* {
    transition: opacity 0.2s ease-in-out;
  }
}

.m-listing-card-image-counter {
  background-color: var(--secondary-400);
  border-radius: var(--border-radius-xl);
  color: var(--monochrome-900);
  padding: var(--size-4) var(--size-12);
  position: absolute;
  bottom: var(--size-16);
  left: 50%;
  transform: translateX(-50%);
}

.m-listing-card-image-actions {
  background-color: var(--secondary-400);
  border-radius: var(--border-radius-pill);
  display: flex;
  gap: var(--size-4);
  padding: var(--size-4) var(--size-8);
  position: absolute;
  top: var(--size-16);
  right: var(--size-16);
}

.m-listing-card-icon-button {
  align-items: center;
  background-color: transparent;
  border: none;
  color: var(--monochrome-100);
  cursor: pointer;
  display: flex;
  font-size: var(--font-xl);
  height: var(--size-32);
  justify-content: center;
  width: var(--size-32);
  transition: color 0.2s ease-in-out;

  .icon {
    transition: fill 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  .icon-heart {
    fill: transparent;
  }

  &.is-active {
    .icon-heart,
    .icon-edit {
      color: var(--monochrome-900);
    }
    .icon-heart {
      fill: var(--monochrome-900);
    }
  }
}

.m-listing-card-arrow-button {
  align-items: center;
  background-color: var(--secondary-400);
  border: none;
  border-radius: 50%;
  color: var(--monochrome-900);
  cursor: pointer;
  display: flex;
  font-size: var(--font-2xl);
  height: var(--size-40);
  justify-content: center;
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: var(--size-40);

  &--left {
    left: var(--size-16);
  }

  &--right {
    right: var(--size-16);
  }
}

@media (max-width: 1200px) {
  .m-listing-card-image-container {
    width: 100%;
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 768px) {
  .m-listing-card-image-container {
    border-radius: var(--border-radius-2xl);
  }
}
</style>
