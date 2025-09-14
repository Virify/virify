<template>
  <div class="item-details">
    <AtomsCollapsibleHeader
      :is-collapsed="isCollapsed"
      :variant="variant"
      :icon="getSectionIcon()"
      :aria-controls="`item-details-${normalizedTitle}`"
      @toggle="toggleCollapsed"
    >
      <template #title>
        {{ props.title }} <span class="body-sm">({{ itemsArray.length }})</span>
      </template>
    </AtomsCollapsibleHeader>

    <Transition name="item-details-collapse">
      <ul v-show="!isCollapsed" class="item-details__list" :id="`item-details-${normalizedTitle}`">
        <li v-for="(item, index) in itemsArray" :key="index" class="item-details__item">
          <div class="item-details__image">
            <AtomsCloudFlareImage v-if="item.media && item.media[0]" :src="item.media[0].image!" :alt="item.media[0].metadata!" variant="card" class="| image-sm" />
          </div>
          <div class="item-details__content | body-sm">
            <!-- Title row with icon, title, and info button -->
            <div class="item-details__title | font-semibold">
              <div class="item-details__title-content">
                <AtomsIcon :icon="getItemIcon(item)" :size="20" />
                {{ getItemTitle(item) }}
              </div>
              <button v-if="item.description" @click="openDescription(index, $event)" class="button button-xs button-quiet" type="button" :aria-label="`Show description for ${getItemTitle(item)}`">
                <AtomsIcon icon="property/info" :size="22" />
              </button>
            </div>

            <!-- Size and floor info -->
            <div class="item-details__details-row">
              <div v-if="item.size" class="item-details__detail">
                <AtomsIcon icon="property/size" :size="24" />
                {{ item.size }}sqmt
              </div>
              <div v-if="showFloor && 'floor' in item && item.floor !== undefined" class="item-details__detail">
                <AtomsIcon icon="property/floor" :size="24" />
                {{ getFloorText((item as any).floor) }}
              </div>
            </div>

            <!-- Features -->
            <div v-if="getFeatures(item).length > 0" class="item-details__features">
              <AtomsPill v-for="feature in getFeatures(item)" :key="feature" class="| body-xs">
                {{ feature }}
              </AtomsPill>
            </div>
          </div>
        </li>
      </ul>
    </Transition>
  </div>

  <!-- Description modal -->
  <AtomsInfoModal 
    :show="activeDescription !== null" 
    :content="activeDescription !== null ? itemsArray[activeDescription]?.description || '' : ''" 
    :position="modalPosition"
    @close="closeDescription"
  />
</template>

<script setup lang="ts">
import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";

interface Props {
  title: string;
  type: "room" | "garden";
  subtype?: string; // For room types like "Bedroom", "Bathroom", etc.
  items:
    | Prisma.BedroomGetPayload<{ include: { media: true } }>[]
    | Prisma.BathroomGetPayload<{ include: { media: true } }>[]
    | Prisma.ReceptionGetPayload<{ include: { media: true } }>[]
    | Prisma.OtherRoomGetPayload<{ include: { media: true } }>[]
    | Prisma.KitchenGetPayload<{ include: { media: true } }>
    | { gardenType: string; media: any[]; [key: string]: any }[]
    | null
    | undefined;
  showFloor?: boolean;
  variant?: "card" | "plain";
}

const props = withDefaults(defineProps<Props>(), {
  showFloor: true,
  variant: "card",
});


// Normalize items to always be an array
const itemsArray = computed(() => {
  if (!props.items) return [];
  if (Array.isArray(props.items)) return props.items;
  return [props.items];
});

// Display title with count
const displayTitle = computed(() => {
  const count = itemsArray.value.length;
  if (props.type === "garden") {
    return count === 1 ? "Garden (1)" : `Gardens (${count})`;
  }
  return `${props.title} (${count})`;
});

// Normalized title for ID generation
const normalizedTitle = computed(() => {
  return props.title.toLowerCase().replace(/\s+/g, "-");
});

// Collapsible state logic
const isCollapsed = ref(false);

// Set initial collapsed state - only bedrooms open by default
watchEffect(() => {
  isCollapsed.value = props.title.toLowerCase() !== "bedrooms";
});

// Toggle collapse function
const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Description modal state
const activeDescription = ref<number | null>(null);
const { modalPosition, openModal, closeModal } = useInfoModal(() => {
  activeDescription.value = null;
});

// Helper functions
const getSectionIcon = (): string => {
  if (props.type === 'garden') {
    return 'property/front-garden'; // or could be 'property/rear-garden'
  }
  
  // Use the existing room type icon logic based on subtype
  const dummyRoom = {}; // Empty object since we're using subtype
  return getRoomTypeIcon(dummyRoom, props.subtype || props.title);
};

const getItemIcon = (item: any): string => {
  if (props.type === "garden") {
    return getGardenTypeIcon(item.gardenType);
  }
  return getRoomTypeIcon(item, props.subtype || "");
};

const getItemTitle = (item: any): string => {
  if (props.type === "garden") {
    return getGardenType(item);
  }
  return getRoomType(item);
};

// Computed property to filter only TRUE boolean features and convert to readable strings
const getFeatures = (item: any): string[] => {
  if (!item || typeof item !== "object") return [];

  const features: string[] = [];
  Object.entries(item).forEach(([key, value]) => {
    // Skip non-boolean properties or specific properties we handle separately
    if (typeof value === "boolean" && value === true && key !== "description" && key !== "size") {
      features.push(convertRoomEnumToString(key));
    }
  });

  return features;
};

// Description modal methods
const openDescription = (index: number, event: MouseEvent) => {
  activeDescription.value = index;
  openModal(event, -200, 8);
};

const closeDescription = () => {
  activeDescription.value = null;
  closeModal();
};

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.item-details {
  margin: 0;


  &__list {
    list-style: none;
    padding: 0;
    margin: var(--size-24) 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--size-24);

    @include mq.tablet-only {
      grid-template-columns: repeat(2, 1fr);
    }

    @include mq.mobile-only {
      grid-template-columns: 1fr;
      gap: var(--size-24);
    }
  }

  &__item {
    background: var(--background-100);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }

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

    .a-pill {
      background: var(--blue-400);
      color: var(--monochrome-900);
    }
  }

  // Info button icon size
  &__title .button.button-xs.button-quiet .a-icon {
    width: 22px;
    height: 22px;
  }
}

/* Collapse transition styles */
.item-details-collapse-enter-active,
.item-details-collapse-leave-active {
  transition: opacity var(--animation-medium) var(--ease-in-out), transform var(--animation-medium) var(--ease-in-out);
  transform-origin: top;
}

.item-details-collapse-enter-from,
.item-details-collapse-leave-to {
  opacity: 0;
  transform: scaleY(0.95) translateY(-8px);
}
</style>
