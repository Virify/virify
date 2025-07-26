<template>
  
</template>

<script setup lang="ts">
import type { Prisma } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
    bedrooms: Prisma.BedroomGetPayload<{ include: { media: true } }>[]
    bathrooms: Prisma.BathroomGetPayload<{ include: { media: true } }>[]
    receptions: Prisma.ReceptionGetPayload<{ include: { media: true } }>[]
    otherRooms: Prisma.OtherRoomGetPayload<{ include: { media: true } }>[]
  }

const props = defineProps<Props>();

onMounted(() => {
  console.log("bedrooms:", props.bedrooms);
  console.log("bathrooms:", props.bathrooms);
  console.log("receptions:", props.receptions);
  console.log("otherRooms:", props.otherRooms);
});

</script>

<style lang="scss">
.room-summary {
  margin: var(--size-32) 0;
}
</style>