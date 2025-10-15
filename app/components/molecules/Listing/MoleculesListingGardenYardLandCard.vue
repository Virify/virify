<template>
  <li class="listing-garden-yard-land-card">
    <div v-if="item.media && item.media.length > 0 && item.media[0]" class="listing-garden-yard-land-card__image">
      <AtomsCloudFlareImage 
        :src="item.media[0].image!" 
        :alt="item.media[0].metadata!" 
        variant="card" 
        class="| image-sm" 
      />
    </div>
    <div class="listing-garden-yard-land-card__content | body-sm">
      <!-- Title row with icon, name, and info button -->
      <div class="listing-garden-yard-land-card__title | font-semibold">
        <div class="listing-garden-yard-land-card__title-content">
          <AtomsIcon :icon="icon" :size="20" />
          {{ item.name }}
        </div>
        <AtomsTooltip v-if="item.description" :responsive="true">
          <AtomsIcon icon="property/info" :size="22" />
          <template #tooltip>
            <p class="body-xs">{{ item.description }}</p>
          </template>
        </AtomsTooltip>
      </div>

      <!-- Size info -->
      <div v-if="item.size" class="listing-garden-yard-land-card__details-row">
        <div class="listing-garden-yard-land-card__detail">
          <AtomsIcon icon="property/size" :size="24" />
          {{ Math.round(item.size) }}sqmt
        </div>
      </div>

      <!-- Features -->
      <div v-if="features.length > 0" class="listing-garden-yard-land-card__features">
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
    | Prisma.GardenGetPayload<{ include: { media: true } }>
    | Prisma.YardGetPayload<{ include: { media: true } }>
    | Prisma.LandGetPayload<{ include: { media: true } }>;
  type: 'garden' | 'yard' | 'land';
}

const props = defineProps<Props>();

// Icon based on type
const icon = computed(() => {
  if (props.type === 'land') return 'property/land';
  return 'property/rear-garden'; // garden and yard use same icon
});

// Extract features
const features = computed(() => {
  const features: string[] = [];
  
  // Add position and facing first (for gardens and yards)
  if ((props.type === 'garden' || props.type === 'yard') && 'position' in props.item && props.item.position) {
    features.push(convertRoomEnumToString(props.item.position));
    if ('facing' in props.item && props.item.facing) {
      features.push(`${convertRoomEnumToString(props.item.facing)} Facing`);
    }
  }
  
  // Add boolean features (excluding business logic fields)
  Object.entries(props.item).forEach(([key, value]) => {
    if (typeof value === "boolean" && value === true && 
        key !== "separateParcel" && key !== "additionalDetails") {
      features.push(convertRoomEnumToString(key));
    }
  });
  
  return features;
});
</script>

<style lang="scss" scoped>
.listing-garden-yard-land-card {
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
