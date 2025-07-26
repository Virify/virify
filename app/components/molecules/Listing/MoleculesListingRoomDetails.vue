<template>
  <!-- bedrooms -->
  <div class="room-details">
    <h2 class="| title-sm">{{ roomTitle }}</h2>
    <ul class="room-details__list">
      <li v-for="(room, index) in rooms" :key="index" class="room-details__item">
        <div class="room-details__item-image">
          <nuxt-img v-if="room.media[0]" :src="room.media[0].image!" :alt="room.media[0].metadata!" class="| image-sm"
            width="300" />
        </div>
        <div class="room-details__item-content | body-sm">
          <p class="room-details__item-content-type | font-semibold">
            <AtomsIcon :icon="getRoomIcon(room)" :size="20" class="room-details__type-icon" />
            {{ getRoomType(room) }}
          </p>
          <p class="room-details__item-detail">
            <AtomsIcon icon="property/size" :size="24" class="room-details__icon" />
            <strong>{{ room.size }}</strong>sqmt
          </p>
          <p class="room-details__item-detail">
            <AtomsIcon icon="property/floor" :size="24" class="room-details__icon" />
            {{ getFloorText(room.floor) }}
          </p>
        </div>
      </li>
    </ul>
  </div>

</template>
<script setup lang="ts">
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
  console.log('Room data:', room);
  console.log('Props type:', props.type);

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
  }

  &__item {
    background-color: var(--color-background-secondary);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    width: 250px;
    background: var(--background-900);

    &-image {
      width: 100%;
      height: auto;
      border-radius: var(--border-radius-lg);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      overflow: hidden;
      aspect-ratio: 16 / 9;
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

    &-detail {
      display: flex;
      align-items: center;
      gap: var(--size-8);
    }
  }

  .a-icon {
    width: 20px !important;
    height: 20px !important;
    color: var(--monochrome-400) !important;
  }
}
</style>