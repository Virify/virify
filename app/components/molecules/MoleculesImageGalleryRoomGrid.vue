<template>
  <div
    class="gallery-room-grid"
    @click="handleBackdropClick"
  >
    <!-- Bottom Bar with Close Button -->
    <AtomsBottomBar
      title="Photos"
      @close="closeModal"
    >
      <template #right>
        <button
          class="gallery-room-grid__close-btn"
          @click="closeModal"
          aria-label="Close gallery"
        >
          <AtomsIcon
            icon="cross"
            :size="24"
          />
        </button>
      </template>
    </AtomsBottomBar>

    <!-- Content Area -->
    <div class="gallery-room-grid__content">
      <!-- Room Categories -->
      <section
        v-for="category in categorizedRooms"
        :key="category.type"
        class="gallery-room-grid__section | container"
      >
        <h2 class="gallery-room-grid__section-title">{{ category.title }}</h2>
        <div class="gallery-room-grid__grid">
          <button
            v-for="(image, index) in category.images"
            :key="`${category.type}-${index}`"
            class="gallery-room-grid__image-button"
            @click="openImageModal(image.globalIndex)"
          >
            <AtomsCloudFlareImage
              :src="image.src"
              :alt="image.alt"
              variant="gallery"
              class="gallery-room-grid__image w-full h-full"
            />
            <span
              v-if="image.alt !== 'Property image'"
              class="gallery-room-grid__image-caption | body-sm"
              >{{
                image.alt.length > 100 ? image.alt.substring(0, 100) + "…" : image.alt
              }}</span
            >
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface ImageData {
    src: string;
    alt: string;
    bedroomId?: number | null;
    bathroomId?: number | null;
    kitchenId?: number | null;
    receptionId?: number | null;
    otherRoomId?: number | null;
    gardenId?: number | null;
    yardId?: number | null;
    landId?: number | null;
    outdoorSpaceId?: number | null;
    globalIndex: number;
  }

  interface RoomCategory {
    type: string;
    title: string;
    images: ImageData[];
  }

  interface Props {
    images: ImageData[];
  }

  interface Emits {
    (e: "close"): void;
    (e: "open-image", imageIndex: number): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  // Group images by room type
  const categorizedRooms = computed<RoomCategory[]>(() => {
    const categories: RoomCategory[] = [];

    // Group by room type
    const bedrooms = props.images.filter((img) => img.bedroomId);
    const bathrooms = props.images.filter((img) => img.bathroomId);
    const kitchens = props.images.filter((img) => img.kitchenId);
    const receptions = props.images.filter((img) => img.receptionId);
    const otherRooms = props.images.filter((img) => img.otherRoomId);
    const outdoorSpaces = props.images.filter((img) => img.outdoorSpaceId);
    const gardens = props.images.filter((img) => img.gardenId);
    const yards = props.images.filter((img) => img.yardId);
    const lands = props.images.filter((img) => img.landId);

    // Uncategorized (no room assignment)
    const uncategorized = props.images.filter(
      (img) =>
        !img.bedroomId &&
        !img.bathroomId &&
        !img.kitchenId &&
        !img.receptionId &&
        !img.otherRoomId &&
        !img.outdoorSpaceId &&
        !img.gardenId &&
        !img.yardId &&
        !img.landId,
    );

    // Add categories in order (matching listing details order)
    if (uncategorized.length > 0) {
      categories.push({
        type: "uncategorized",
        title: "Property Photos",
        images: uncategorized,
      });
    }
    if (bedrooms.length > 0) {
      categories.push({ type: "bedrooms", title: "Bedrooms", images: bedrooms });
    }
    if (bathrooms.length > 0) {
      categories.push({ type: "bathrooms", title: "Bathrooms", images: bathrooms });
    }
    if (kitchens.length > 0) {
      categories.push({ type: "kitchen", title: "Kitchen", images: kitchens });
    }
    if (receptions.length > 0) {
      categories.push({ type: "receptions", title: "Receptions", images: receptions });
    }
    if (otherRooms.length > 0) {
      categories.push({ type: "otherRooms", title: "Other Rooms", images: otherRooms });
    }
    if (outdoorSpaces.length > 0) {
      categories.push({
        type: "outdoorSpace",
        title: "Outdoor Space",
        images: outdoorSpaces,
      });
    }
    if (gardens.length > 0) {
      categories.push({ type: "gardens", title: "Gardens", images: gardens });
    }
    if (yards.length > 0) {
      categories.push({ type: "yards", title: "Yards", images: yards });
    }
    if (lands.length > 0) {
      categories.push({ type: "land", title: "Land", images: lands });
    }

    return categories;
  });

  function openImageModal(index: number) {
    emit("open-image", index);
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function closeModal() {
    emit("close");
  }

  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
    document.body.style.overflow = "hidden";
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeydown);
    document.body.style.overflow = "";
  });
</script>

<style lang="scss">
  @use "#styles/_utils/media" as mq;

  .gallery-room-grid {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--background-200);
    display: flex;
    flex-direction: column;
    user-select: none;

    &__close-btn {
      background: rgba(255, 255, 255, 0.15);
      border: none;
      padding: var(--size-8);
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--size-4);
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);

      &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.1);
      }

      &:focus-visible {
        outline: 2px solid white;
        outline-offset: 2px;
      }
    }

    &__content {
      flex: 1;
      overflow-y: auto;
      padding: var(--size-32) var(--size-32) var(--size-120);

      @include mq.mobile-only {
        padding: var(--size-16) 0;
      }
    }

    &__section {
      margin-bottom: var(--size-48);

      @include mq.mobile-only {
        margin-bottom: var(--size-32);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__section-title {
      margin-bottom: var(--size-20);

      @include mq.mobile-only {
        margin-bottom: var(--size-16);
      }
    }

    &__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--size-8);

      @include mq.mobile-only {
        grid-template-columns: 1fr;
        gap: var(--size-16);
      }

      @include mq.tablet-only {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--size-12);
      }

      @include mq.notebook {
        grid-template-columns: repeat(4, 1fr);
        gap: var(--size-16);
      }
    }

    &__image-button {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      position: relative;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      aspect-ratio: auto;
      display: block;
      border-radius: var(--border-radius-lg);
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
      }
    }

    &__image-caption {
      padding: var(--size-8) var(--size-4);
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  // Smooth transitions for modal
  .gallery-room-grid {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
</style>
