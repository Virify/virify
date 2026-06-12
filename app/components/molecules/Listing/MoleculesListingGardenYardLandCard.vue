<template>
  <li class="listing-garden-yard-land-card">
    <div
      v-if="item.media && item.media.length > 0 && item.media[0]"
      class="listing-garden-yard-land-card__image"
    >
      <AtomsCloudFlareImage
        :src="item.media[0]?.image!"
        :alt="item.media[0]?.metadata!"
        variant="card"
        class="| image-sm"
      />
    </div>
    <div
      v-else
      class="listing-garden-yard-land-card__image listing-garden-yard-land-card__image--placeholder"
    >
      <UIcon
        name="i-lucide-image-off"
        class="listing-garden-yard-land-card__placeholder-icon size-20"
      />
    </div>
    <div class="listing-garden-yard-land-card__content | body-sm">
      <!-- Title row with icon and name -->
      <div class="listing-garden-yard-land-card__title | font-semibold">
        <div class="listing-garden-yard-land-card__title-content">
          <AtomsIcon
            :icon="icon"
            :size="20"
          />
          {{ item.name }}
        </div>
      </div>

      <!-- Size info -->
      <div
        v-if="item.size"
        class="listing-garden-yard-land-card__details-row"
      >
        <div class="listing-garden-yard-land-card__detail">
          <AtomsIcon
            icon="property/size"
            :size="24"
          />
          {{ Math.round(item.size) }}sqmt
        </div>
      </div>

      <!-- Features -->
      <div
        v-if="features.length > 0"
        class="listing-garden-yard-land-card__features"
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
        <p
          class="listing-garden-yard-land-card__description-label | body-xs font-semibold"
        >
          Description
        </p>
        <p
          class="listing-garden-yard-land-card__description | body-xs"
          :class="{
            'listing-garden-yard-land-card__description--collapsed': !descriptionExpanded,
          }"
        >
          {{ item.description }}
        </p>
        <button
          class="listing-garden-yard-land-card__description-toggle | body-xs"
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
      | Prisma.GardenGetPayload<{ include: { media: true } }>
      | Prisma.YardGetPayload<{ include: { media: true } }>
      | Prisma.LandGetPayload<{ include: { media: true } }>;
    type: "garden" | "yard" | "land";
  }

  const props = defineProps<Props>();

  // Icon based on type
  const icon = computed(() => {
    if (props.type === "land") return "property/land";
    return "property/rear-garden"; // garden and yard use same icon
  });

  // Extract features
  const descriptionExpanded = ref(false);

  const features = computed(() => {
    const features: string[] = [];

    // Add position and facing first (for gardens and yards)
    if (
      (props.type === "garden" || props.type === "yard") &&
      "position" in props.item &&
      props.item.position
    ) {
      features.push(convertEnumToString(props.item.position));
      if ("facing" in props.item && props.item.facing) {
        features.push(`${convertEnumToString(props.item.facing)} Facing`);
      }
    }

    // Add features from the features array (new enum-based structure)
    if (props.item.features?.length) {
      props.item.features.forEach((feature: string) => {
        features.push(convertEnumToString(feature));
      });
    }

    return features;
  });
</script>

<style lang="scss" scoped>
  .listing-garden-yard-land-card {
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

      &--placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--background-300);
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
