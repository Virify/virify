<template>
  <div class="room-summary">
    <!-- bedrooms -->
    <MoleculesListingRoom :rooms="bedrooms" type="Bedroom" title="Bedrooms" />
    <!-- bathrooms -->
    <MoleculesListingRoom :rooms="bathrooms" type="Bathroom" title="Bathrooms" />
    <!-- receptions -->
    <MoleculesListingRoom :rooms="receptions" type="Reception" title="Receptions" />
    <!-- other rooms -->
    <MoleculesListingRoom :rooms="otherRooms" type="Other Rooms" title="Other Rooms" />
  </div>
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
  padding: var(--size-16);
}
</style>