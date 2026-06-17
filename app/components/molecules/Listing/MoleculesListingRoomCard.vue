<template>
  <li class="listing-room-card">
    <div
      v-if="item.media && item.media.length > 0"
      class="listing-room-card__image"
    >
      <AtomsCloudFlareImage
        :src="item.media[activeIndex]?.image!"
        :alt="item.media[activeIndex]?.metadata!"
        variant="card"
        class="w-full h-full aspect-4/3 object-cover"
      />
      <template v-if="item.media.length > 1">
        <button
          class="listing-room-card__carousel-btn listing-room-card__carousel-btn--prev"
          aria-label="Previous image"
          @click.stop="prev"
        >
          <UIcon name="i-lucide-chevron-left" />
        </button>
        <button
          class="listing-room-card__carousel-btn listing-room-card__carousel-btn--next"
          aria-label="Next image"
          @click.stop="next"
        >
          <UIcon name="i-lucide-chevron-right" />
        </button>
        <div class="listing-room-card__carousel-dots">
          <span
            v-for="(_, i) in item.media"
            :key="i"
            class="listing-room-card__carousel-dot"
            :class="{ 'listing-room-card__carousel-dot--active': i === activeIndex }"
          />
        </div>
      </template>
    </div>
    <div
      v-else
      class="listing-room-card__image listing-room-card__image--placeholder"
    >
      <UIcon
        name="i-lucide-image-off"
        class="listing-room-card__placeholder-icon size-20"
      />
    </div>
    <div class="listing-room-card__content | body-sm">
      <!-- Title row with icon and title -->
      <div class="listing-room-card__title | font-semibold">
        <div class="listing-room-card__title-content">
          <AtomsIcon
            :icon="roomIcon"
            :size="20"
          />
          {{ roomTitle }}
        </div>
      </div>

      <!-- Size and floor info -->
      <div
        v-if="hasDetails"
        class="listing-room-card__details-row"
      >
        <div
          v-if="item.size"
          class="listing-room-card__detail"
        >
          <AtomsIcon
            icon="property/size"
            :size="24"
          />
          {{ item.size }}sqmt
        </div>
        <div
          v-if="showFloor && item.floor !== undefined"
          class="listing-room-card__detail"
        >
          <AtomsIcon
            icon="property/floor"
            :size="24"
          />
          {{ getFloorText(item.floor) }}
        </div>
      </div>

      <!-- Features -->
      <div
        v-if="features.length > 0"
        class="listing-room-card__features"
      >
        <AtomsPill
          v-for="feature in features"
          :key="feature"
          class="| body-xs"
        >
          {{ feature }}
        </AtomsPill>
      </div>

      <!-- Inline description with read more -->
      <template v-if="item.description">
        <p class="listing-room-card__description-label | body-xs font-semibold">
          Description
        </p>
        <p
          class="listing-room-card__description | body-xs"
          :class="{ 'listing-room-card__description--collapsed': !descriptionExpanded }"
        >
          {{ item.description }}
        </p>
        <button
          class="listing-room-card__description-toggle | body-xs"
          @click.stop="descriptionExpanded = !descriptionExpanded"
        >
          {{ descriptionExpanded ? "Show less" : "Read more" }}
        </button>
      </template>
    </div>
  </li>
</template>

<script setup lang="ts">
  import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";

  interface Props {
    item:
      | Prisma.BedroomGetPayload<{ include: { media: true } }>
      | Prisma.BathroomGetPayload<{ include: { media: true } }>
      | Prisma.ReceptionGetPayload<{ include: { media: true } }>
      | Prisma.OtherRoomGetPayload<{ include: { media: true } }>
      | Prisma.KitchenGetPayload<{ include: { media: true } }>;
    subtype?: string;
    showFloor?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    showFloor: true,
  });

  // Computed properties
  const roomIcon = computed(() => getRoomTypeIcon(props.item, props.subtype || ""));
  const roomTitle = computed(() => getRoomType(props.item));

  const hasDetails = computed(() => {
    return (
      props.item.size ||
      (props.showFloor && "floor" in props.item && props.item.floor !== undefined)
    );
  });

  const descriptionExpanded = ref(false);
  const activeIndex = ref(0);

  function prev() {
    activeIndex.value =
      activeIndex.value === 0 ? props.item.media.length - 1 : activeIndex.value - 1;
  }
  function next() {
    activeIndex.value =
      activeIndex.value === props.item.media.length - 1 ? 0 : activeIndex.value + 1;
  }

  const features = computed(() => {
    if (!props.item.features?.length) return [];

    return props.item.features.map((feature: string) => convertEnumToString(feature));
  });
</script>

<style lang="scss" scoped>
  .listing-room-card {
    background: var(--background-200);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;

    &__image {
      height: auto;
      border-radius: var(--border-radius-lg);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      position: relative;

      img {
        width: 100%;
      }

      &--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--background-300);
      }
    }

    &__carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.45);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1;

      &--prev {
        left: var(--size-8);
      }
      &--next {
        right: var(--size-8);
      }

      &:hover {
        background: rgba(0, 0, 0, 0.65);
      }
    }

    &__carousel-dots {
      position: absolute;
      bottom: var(--size-8);
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: var(--size-4);
    }

    &__carousel-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);

      &--active {
        background: #fff;
      }
    }

    &__placeholder-icon {
      color: var(--monochrome-500);
    }

    &__content {
      padding: var(--size-16);
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--size-8);
    }

    &__title {
      text-transform: capitalize;
      display: flex;
      align-items: center;
      gap: var(--size-8);
    }

    &__title-content {
      display: flex;
      align-items: center;
      gap: var(--size-8);
    }

    &__description-label {
      color: var(--foreground-200);
      margin-bottom: calc(var(--size-4) * -1);
    }

    &__description {
      color: var(--foreground-300);
      line-height: var(--lineheight-md);

      &--collapsed {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    &__description-toggle {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      color: var(--primary-400);
      text-decoration: underline;
      text-underline-offset: 2px;
      display: block;
      text-align: left;

      &:hover {
        opacity: 0.8;
      }
    }

    &__details-row {
      display: flex;
      align-items: center;
      gap: var(--size-16);
    }

    &__detail {
      display: flex;
      align-items: center;
      gap: var(--size-8);
    }

    &__features {
      display: flex;
      flex-wrap: wrap;
      gap: var(--size-4);
      margin-top: var(--size-4);

      :deep(.a-pill) {
        background: var(--blue-400);
        color: var(--monochrome-900);
      }
    }
  }
</style>
