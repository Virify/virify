<template>
  <li class="listing-room-card">
    <div v-if="item.media && item.media.length > 0 && item.media[0]" class="listing-room-card__image">
      <AtomsCloudFlareImage 
        :src="item.media[0].image!" 
        :alt="item.media[0].metadata!" 
        variant="card" 
        class="w-full h-full aspect-4/3 object-cover" 
      />
    </div>
    <div class="listing-room-card__content | body-sm">
      <!-- Title row with icon, title, and info button -->
      <div class="listing-room-card__title | font-semibold">
        <div class="listing-room-card__title-content">
          <AtomsIcon :icon="roomIcon" :size="20" />
          {{ roomTitle }}
        </div>
        <AtomsTooltip v-if="item.description" :responsive="true">
          <AtomsIcon icon="property/info" :size="22" />
          <template #tooltip>
            <p class="body-xs">{{ item.description }}</p>
          </template>
        </AtomsTooltip>
      </div>

      <!-- Size and floor info -->
      <div v-if="hasDetails" class="listing-room-card__details-row">
        <div v-if="item.size" class="listing-room-card__detail">
          <AtomsIcon icon="property/size" :size="24" />
          {{ item.size }}sqmt
        </div>
        <div v-if="showFloor && item.floor !== undefined" class="listing-room-card__detail">
          <AtomsIcon icon="property/floor" :size="24" />
          {{ getFloorText(item.floor) }}
        </div>
      </div>

      <!-- Features -->
      <div v-if="features.length > 0" class="listing-room-card__features">
        <AtomsPill v-for="feature in features" :key="feature" class="| body-xs">
          {{ feature }}
        </AtomsPill>
      </div>
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
  return props.item.size || (props.showFloor && 'floor' in props.item && props.item.floor !== undefined);
});

const features = computed(() => {
  if (!props.item.features?.length) return [];

  return props.item.features.map((feature: string) => convertEnumToString(feature));
});
</script>

<style lang="scss" scoped>
.listing-room-card {
  background: var(--background-100);
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

    img {
      width: 100%;
    }
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
    justify-content: space-between;
    gap: var(--size-8);
  }

  &__title-content {
    display: flex;
    align-items: center;
    gap: var(--size-8);
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
