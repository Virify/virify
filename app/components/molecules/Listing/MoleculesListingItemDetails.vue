<template>
  <div class="item-details">
    <h2 class="| title-sm">{{ displayTitle }}</h2>
    <ul class="item-details__list">
      <li v-for="(item, index) in itemsArray" :key="index" class="item-details__item">
        <div class="item-details__image">
          <nuxt-img v-if="item.media && item.media[0]" :src="item.media[0].image!" :alt="item.media[0].metadata!"
            class="| image-sm" />
        </div>
        <div class="item-details__content | body-sm">
          <!-- Title row with icon, title, and info button -->
          <div class="item-details__title | font-semibold">
            <AtomsIcon :icon="getItemIcon(item)" :size="20" />
            {{ getItemTitle(item) }}
            <button v-if="item.description" @click="toggleDescription(index, $event)"
              class="button button-xs button-quiet" type="button"
              :aria-label="`Show description for ${getItemTitle(item)}`">
              <AtomsIcon icon="property/info" :size="18" />
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
  </div>

  <!-- Description modal teleported to body for proper positioning -->
  <Teleport to="body">
    <div v-if="activeDescription !== null && itemsArray[activeDescription]?.description" class="item-details-modal"
      :style="modalPosition" @click.stop>
      <p class="| body-xs">{{ itemsArray[activeDescription]?.description }}</p>
      <button @click="closeDescription" class="item-details-modal__close" type="button"
        aria-label="Close description">
        <AtomsIcon icon="property/close" :size="14" />
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Prisma } from '~~/layers/database/server/database/prisma/generated/client';
import { convertEnumToString } from '~/utils/listing/room-config';

interface Props {
  title: string;
  type: 'room' | 'garden';
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
}

const props = withDefaults(defineProps<Props>(), {
  showFloor: true
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
  if (props.type === 'garden') {
    return count === 1 ? 'Garden (1)' : `Gardens (${count})`;
  }
  return `${props.title} (${count})`;
});

// Description modal state
const activeDescription = ref<number | null>(null);
const modalPosition = ref({});


// Helper functions
const getItemIcon = (item: any): string => {
  if (props.type === 'garden') {
    return getGardenTypeIcon(item.gardenType);
  }
  return getRoomTypeIcon(item, props.subtype || '');
};

const getItemTitle = (item: any): string => {
  if (props.type === 'garden') {
    return getGardenType(item);
  }
  return getRoomType(item);
};

// Computed property to filter only TRUE boolean features and convert to readable strings
const getFeatures = (item: any): string[] => {
  if (!item || typeof item !== 'object') return [];

  const features: string[] = [];
  Object.entries(item).forEach(([key, value]) => {
    // Skip non-boolean properties or specific properties we handle separately
    if (typeof value === 'boolean' && value === true && key !== 'description' && key !== 'size') {
      features.push(convertEnumToString(key));
    }
  });

  return features;
};

// Description modal methods
const toggleDescription = (index: number, event: Event) => {
  if (activeDescription.value === index) {
    closeDescription();
    return;
  }

  const button = event.target as HTMLElement;
  const rect = button.getBoundingClientRect();

  modalPosition.value = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left - 200}px`,
    zIndex: 1000
  };

  activeDescription.value = index;
};

const closeDescription = () => {
  activeDescription.value = null;
  modalPosition.value = {};
};


// Close modal on escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && activeDescription.value !== null) {
      closeDescription();
    }
  };

  document.addEventListener('keydown', handleEscape);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.item-details {
  margin: var(--size-32) 0;

  &__list {
    list-style: none;
    padding: 0;
    margin: var(--size-16) 0;
    display: flex;
    flex-direction: row;
    gap: var(--size-16);
    flex-wrap: wrap;
    align-items: stretch;

    @include mq.mobile-only {
      flex-direction: column;
      gap: var(--size-12);
      width: 100%;
    }
  }

  &__item {
    background: var(--background-100);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    width: 300px;
    display: flex;
    flex-direction: column;

    @include mq.mobile-only {
      width: 100%;
    }
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
      background: var(--background-300);
      color: var(--foreground-100);
    }
  }

  .a-icon {
    width: 22px;
    height: 22px;
    color: var(--foreground-200);
    margin-bottom: var(--size-2);
  }
}

/* Modal styles (teleported to body) */
.item-details-modal {
  background: var(--background-100);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  max-width: 300px;
  padding: var(--size-12);
  position: relative;

  p {
    margin: 0;
    line-height: 1.4;
  }

  &__close {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--size-2);
    border-radius: var(--border-radius-sm);
    color: var(--foreground-200);

    &:hover {
      background-color: var(--background-200);
      color: var(--foreground-100);
    }
  }
}
</style>