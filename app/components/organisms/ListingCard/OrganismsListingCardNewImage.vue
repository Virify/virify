<template>
  <div class="m-listing-card-image-wrapper">
    <div
      ref="emblaNode"
      class="m-listing-card-image-container"
      role="region"
      aria-label="Property images"
    >
      <div class="m-listing-card-image-slides">
        <div
          v-for="(img, index) in images"
          :key="index"
          class="m-listing-card-image-slide"
          @click="openImageModal(index)"
        >
          <AtomsCloudFlareImage
            :src="img.image"
            :alt="img.metadata"
            variant="card"
            :placeholder="true"
            class="m-listing-card-image"
          />
        </div>
      </div>
      <div class="m-listing-card-image-overlay">
        <div
          v-if="images.length > 1"
          class="m-listing-card-image-counter | body-xs"
          aria-label="Image counter"
        >
          {{ selectedIndex + 1 }}/{{ images.length }}
        </div>
        <div class="m-listing-card-image-actions" @click.stop>
          <AtomsFavouriteButton
            :listing-id="listingId"
            :confirm-removal="false"
            icon-class="icon-heart"
          />
          <AtomsNoteButton :listing-id="listingId" />
        </div>
        <button
          v-if="images.length > 1"
          class="m-listing-card-arrow-button m-listing-card-arrow-button--left"
          @click.stop="scrollPrev"
          aria-label="Previous image"
          title="Previous image"
        >
          <AtomsIcon
            name="chevron-left"
            icon="chevron-left"
            aria-hidden="true"
          />
        </button>
        <button
          v-if="images.length > 1"
          class="m-listing-card-arrow-button m-listing-card-arrow-button--right"
          @click.stop="scrollNext"
          aria-label="Next image"
          title="Next image"
        >
          <AtomsIcon
            name="chevron-right"
            icon="chevron-right"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
    <slot
      name="side-images"
      :selected-index="selectedIndex"
      :go-to-slide="goToSlide"
      :images="images"
    />
    
    <!-- Image Gallery Modal -->
    <MoleculesImageGalleryModal
      :show="showImageModal"
      :images="galleryImages"
      :initial-index="modalImageIndex"
      @close="closeImageModal"
    />
  </div>
</template>

<script lang="ts" setup>
import emblaCarouselVue from "embla-carousel-vue";
import type { Media } from "~~/layers/database/server/database/prisma/generated/client";

interface Props {
  images: {
    image: Media["image"];
    metadata?: Media["metadata"];
  }[];
  listingId: number;
}

const props = defineProps<Props>();

/**
 *  Media
 */
const images = computed(() => {
  const media = props.images;
  if (!Array.isArray(media)) return [];

  return media
    .filter((item) => item.image !== null)
    .map((item) => ({
      image: item.image!,
      metadata: item.metadata,
    }));
});

const galleryImages = computed(() => {
  return images.value.map((item, index) => ({
    src: item.image,
    alt: (() => {
      try {
        const metadata = typeof item.metadata === 'string' ? JSON.parse(item.metadata) : item.metadata;
        return metadata?.alt || `Property image ${index + 1}`;
      } catch {
        return `Property image ${index + 1}`;
      }
    })()
  }));
});

const [emblaNode, emblaApi] = emblaCarouselVue({ loop: true, startIndex: 0 });
const selectedIndex = ref(0);

// Image Gallery Modal
const showImageModal = ref(false);
const modalImageIndex = ref(0);

const scrollPrev = () => {
  emblaApi.value?.scrollPrev();
};

const scrollNext = () => {
  emblaApi.value?.scrollNext();
};

const goToSlide = (index: number) => {
  emblaApi.value?.scrollTo(index);
};

const onSelect = () => {
  if (!emblaApi.value) return;
  selectedIndex.value = emblaApi.value.selectedScrollSnap();
};

// Modal functions
function openImageModal(imageIndex: number) {
  modalImageIndex.value = imageIndex;
  showImageModal.value = true;
}

function closeImageModal() {
  showImageModal.value = false;
}

onMounted(() => {
  if (emblaApi.value) {
    emblaApi.value.on("select", onSelect);
    onSelect();
  }
});
</script>

<style lang="scss">
.m-listing-card-image-wrapper {
  display: flex;
  width: 100%;
  gap: var(--size-8);
}

.m-listing-card-image-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 1;
  flex-shrink: 0;
  border-radius: var(--border-radius-2xl);

  &:hover .m-listing-card-arrow-button {
    opacity: 1;
  }
}

.m-listing-card-image-slides {
  display: flex;
  height: 100%;
  width: 100%;
}

.m-listing-card-image-slide {
  flex: 0 0 100%;
  min-width: 0;
  position: relative;
  cursor: pointer;
}


.m-listing-card-image {
  object-fit: cover;
  width: 100%;
  // transition: transform 0.2s ease;
}

.m-listing-card-image-overlay {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  pointer-events: none; // Allow clicks to pass through

  > * {
    transition: opacity 0.2s ease-in-out;
    pointer-events: auto; // Re-enable clicks on child elements
  }
}

.m-listing-card-image-counter {
  background-color: var(--blue-400);
  border-radius: var(--border-radius-xl);
  color: var(--monochrome-900);
  padding: var(--size-4) var(--size-12);
  position: absolute;
  bottom: var(--size-16);
  left: 50%;
  transform: translateX(-50%);
}

.m-listing-card-image-actions {
  background-color: var(--blue-400);
  border-radius: var(--border-radius-pill);
  display: flex;
  gap: var(--size-4);
  padding: var(--size-4) var(--size-8);
  position: absolute;
  top: var(--size-16);
  right: var(--size-16);
}

.m-listing-card:not([data-tier="FEATURED"]):not([data-tier="PREMIUM"]) .m-listing-card-image-actions {
  .a-favourite-button:not(.selected),
  .note-button {
    color: var(--monochrome-900);
  }
  
  .a-favourite-button:not(.selected) svg {
    stroke: var(--monochrome-900) !important;
  }
  
  .note-button-icon {
    color: var(--monochrome-900) !important;
  }
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

  &.is-active {
    .icon-edit {
      color: var(--monochrome-900);
    }
  }
}

.a-favourite-button {
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: var(--font-xl);
  height: var(--size-32);
  justify-content: center;
  width: var(--size-32);
  transition: color 0.2s ease-in-out;

  .icon-heart {
    width: var(--size-24);
    height: var(--size-24);
  }
}

.note-button {
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  font-size: var(--font-xl);
  height: var(--size-32);
  justify-content: center;
  width: var(--size-32);
  transition: color 0.2s ease-in-out;

  .note-button-icon {
    width: var(--size-28);
    height: var(--size-28);
  }
}

.m-listing-card-arrow-button {
  align-items: center;
  background-color: var(--blue-400);
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
    width: var(--image-width);
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 768px) {
  .m-listing-card-image-container {
    border-radius: var(--border-radius-2xl);
    aspect-ratio: 4 / 3;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
