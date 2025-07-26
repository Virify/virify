<template>
  <!-- bedrooms -->
  <div class="room-details">
    <h2 class="| title-sm">{{ roomTitle }}</h2>
    <ul class="room-details__list">
      <li v-for="(room, index) in rooms" :key="index" class="room-details__item">
        <div class="room-details__item-image">
          <nuxt-img v-if="room.media[0]" :src="room.media[0].image!" :alt="room.media[0].metadata!"
            class="| image-sm" />
        </div>
        <div class="room-details__item-content | body-sm">
          <p class="room-details__item-content-type | font-semibold">
            <AtomsIcon :icon="getRoomIcon(room)" :size="20" class="room-details__type-icon" />
            {{ getRoomType(room) }}
          </p>
          <div class="room-details__item-header">
            <p class="room-details__item-detail">
              <AtomsIcon icon="property/size" :size="24" class="room-details__icon" />
              {{ room.size }}sqmt
            </p>
            <p class="room-details__item-detail">
              <AtomsIcon icon="property/floor" :size="24" class="room-details__icon" />
              {{ getFloorText(room.floor) }}
            </p>
          </div>
          <div class="room-details__item-features" v-if="getFeatures(room).length > 0">
            <AtomsIcon icon="property/feature" :size="24" class="room-details__icon" />
            <div class="room-details__item-features-pills">
              <AtomsPill v-for="feature in getFeatures(room)" :key="feature" class="| body-xs">
                {{ feature }}
              </AtomsPill>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>

</template>
<script setup lang="ts">
import AtomsPill from '~/components/atoms/AtomsPill.vue';
import type { Prisma } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
  title: string;
  type: string;
  rooms: Prisma.BedroomGetPayload<{ include: { media: true } }>[] |
  Prisma.BathroomGetPayload<{ include: { media: true } }>[] |
  Prisma.ReceptionGetPayload<{ include: { media: true } }>[] |
  Prisma.OtherRoomGetPayload<{ include: { media: true } }>[];
}
const props = defineProps<Props>();


// Computed properties
const roomTitle = computed(() => `${props.title} (${props.rooms.length})`);

// Helper functions
const getFloorText = (floorNumber: number | null): string => {
  if (floorNumber === null) return "Unknown Floor";
  if (floorNumber === 0) return "Ground Floor";
  if (floorNumber === 1) return "First Floor";
  if (floorNumber === 2) return "Second Floor";
  if (floorNumber > 2) return `${floorNumber}th Floor`;
  return "Unknown Floor";
};

const getRoomType = (room: any): string => {
  return room.type ? convertEnumToString(room.type).toLowerCase() : room.name;
};

const getRoomIcon = (room: any): string => {
  // Check the room type from the props.type or infer from the room data structure
  if (props.type === 'Bedroom' || room.hasOwnProperty('bedSize')) {
    return 'property/bedrooms';
  }
  if (props.type === 'Bathroom' || room.hasOwnProperty('shower') || room.hasOwnProperty('bath')) {
    return 'property/bathrooms';
  }

  // Check room.type for other room types if it exists
  const roomType = getRoomType(room);
  switch (roomType) {
    case 'gym':
      return 'property/gym';
    case 'office':
      return 'property/work';
    case 'study':
      return 'property/work';
    default:
      return 'property/other-room';
  }
};

const getFeatures = (room: any) => {
  return Object.entries(room)
    .filter(([key, value]) => typeof value === 'boolean' && value === true)
    .map(([key]) => key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    );
};
</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;


.room-details {
  margin: var(--size-32) 0;

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    gap: var(--size-16);
    margin: var(--size-16) 0;
    flex-wrap: wrap;

    @include mq.mobile-only {
      justify-content: center;
      align-items: center;
      width: 100%;
    }
  }

  &__item {
    background-color: var(--color-background-secondary);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    width: 300px;
    background: var(--background-100);

    @include mq.mobile-only {
      width: 100%;
    }

    &-image {
      height: auto;
      border-radius: var(--border-radius-lg);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      overflow: hidden;
      aspect-ratio: 16 / 9;

      img {
        width: 300px;
      }

      @include mq.mobile-only {
        img {
          width: 100%;
        }
      }
    }

    &-content {
      padding: var(--size-16);

      &-type {
        text-transform: capitalize;
        display: flex;
        align-items: center;
        gap: var(--size-8);
      }
    }

    &-header {
      display: flex;
      align-items: center;
      gap: var(--size-16);
      margin: var(--size-8) 0;

    }

    &-detail {
      display: flex;
      align-items: center;
      gap: var(--size-8);
    }

    &-features {
      display: flex;
      align-items: flex-start;
      gap: var(--size-4);
      margin: var(--size-12) 0;

      .a-icon {
        flex-shrink: 0;
      }

      &-pills {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-4);
        flex: 1;

        .a-pill {
          background: var(--background-300);
          color: var(--foreground-100);
        }
      }
    }
  }

  .a-icon {
    width: 22px;
    height: 22px;
    color: var(--foreground-200);
    margin-bottom: var(--size-2);
  }
}
</style>