<template>
  <li class="listing-outdoor-space-card">
    <div v-if="outdoorSpace.media && outdoorSpace.media.length > 0 && outdoorSpace.media[0]"
      class="listing-outdoor-space-card__image">
      <AtomsCloudFlareImage :src="outdoorSpace.media[0].image!" :alt="outdoorSpace.media[0].metadata!" variant="card"
        class="| image-sm" />
    </div>
    <div class="listing-outdoor-space-card__content | body-sm">
      <!-- Title row with icon and info button -->
      <div class="listing-outdoor-space-card__title | font-semibold">
        <div class="listing-outdoor-space-card__title-content">
          <AtomsIcon icon="property/rear-garden" :size="20" />
          Outdoor Space
        </div>
        <AtomsTooltip v-if="outdoorSpace.description" :responsive="true">
          <AtomsIcon icon="property/info" :size="22" />
          <template #tooltip>
            <p class="body-xs">{{ outdoorSpace.description }}</p>
          </template>
        </AtomsTooltip>
      </div>

      <!-- Total Area -->
      <div v-if="totalArea" class="listing-outdoor-space-card__details-row">
        <div class="listing-outdoor-space-card__detail">
          <AtomsIcon icon="property/size" :size="24" />
          Total Area: {{ Math.round(totalArea) }}sqmt
        </div>
      </div>

      <!-- Features -->
      <div v-if="features.length > 0" class="listing-outdoor-space-card__features">
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
  outdoorSpace: Prisma.OutdoorSpaceGetPayload<{ include: { media: true; garden: true; yard: true; land: true } }>;
  totalArea?: number | null;
  hasGardens?: boolean;
  hasYards?: boolean;
  hasLand?: boolean;
}

const props = defineProps<Props>();

// Extract features from outdoor space
const features = computed(() => {
  const features: string[] = [];

  // Show what it contains (Garden, Yard, Land)
  if (props.hasGardens) {
    features.push("Garden");
  }
  if (props.hasYards) {
    features.push("Yard");
  }
  if (props.hasLand) {
    features.push("Land");
  }

  // Add features from the features array (new enum-based structure)
  if (props.outdoorSpace.features?.length) {
    props.outdoorSpace.features.forEach((feature: string) => {
      features.push(convertEnumToString(feature));
    });
  }

  return features;
});
</script>

<style lang="scss" scoped>
.listing-outdoor-space-card {
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
