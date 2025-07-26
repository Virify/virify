<template>
  <!-- bedrooms -->
  <h2 class="| title-md">{{ roomTitle }}</h2>
  <ul class="room__list">
    <li v-for="(room, index) in rooms" :key="index" class="room__item">
      <div class="room__item-image">
        <nuxt-img v-if="room.media[0]" :src="room.media[0].image!" :alt="room.media[0].metadata!" class="| image-sm"
          width="230" />
      </div>
      <div class="room__item-content | body-sm font-semibold">
        <p>{{ type }}</p>
        <p>{{ room.size }} sqmt</p>
        <p>{{ getFloorText(room.floor) }}</p>
        <p v-if="'enSuite' in room && room.enSuite">En Suite</p>
      </div>
    </li>
  </ul>
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

function getFloorText(floorNumber: number | null): string {
  if (floorNumber === null) return "Unknown Floor";
  if (floorNumber === 0) return "Ground Floor";
  if (floorNumber === 1) return "First Floor";
  if (floorNumber === 2) return "Second Floor";
  if (floorNumber > 2) return `${floorNumber}th Floor`;
  return "Unknown Floor";
}

const roomTitle = computed(() => {
  return props.title + ' (' + props.rooms.length + ')';
});
</script>
<style lang="scss">
@use "#styles/_utils/media" as mq;

.room {
  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    gap: var(--size-16);
    margin-bottom: var(--size-24);
    flex-wrap: wrap;
  }

  &__item {
    background-color: var(--color-background-secondary);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    min-width: 200px;

    &-image {
      width: 100%;
      height: auto;
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }

    &-content {
      padding: var(--size-8);
    }
  }
}
</style>