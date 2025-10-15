<template>
  <div class="item-details">
    <AtomsCollapsibleHeader
      :is-collapsed="isCollapsed"
      :variant="variant"
      :icon="sectionIcon"
      :aria-controls="`item-details-${normalizedTitle}`"
      @toggle="toggleCollapsed"
    >
      <template #title>
        {{ props.title }} <span class="body-sm">({{ totalCount }})</span>
      </template>
    </AtomsCollapsibleHeader>

    <Transition name="item-details-collapse">
      <div v-show="!isCollapsed" :id="`item-details-${normalizedTitle}`">
        <ul class="item-details__list">
          <!-- Outdoor Space Card -->
          <template v-if="props.type === 'outdoorspace'">
            <MoleculesListingOutdoorSpaceCard
              v-if="outdoorSpaceItem"
              :outdoor-space="outdoorSpaceItem"
              :total-area="props.totalArea"
              :has-gardens="props.hasGardens"
              :has-yards="props.hasYards"
              :has-land="props.hasLand"
            />
            
            <!-- Garden Cards -->
            <MoleculesListingGardenYardLandCard
              v-for="(garden, index) in props.gardens"
              :key="`garden-${index}`"
              :item="garden"
              type="garden"
            />
            
            <!-- Yard Cards -->
            <MoleculesListingGardenYardLandCard
              v-for="(yard, index) in props.yards"
              :key="`yard-${index}`"
              :item="yard"
              type="yard"
            />
            
            <!-- Land Cards -->
            <MoleculesListingGardenYardLandCard
              v-for="(land, index) in props.lands"
              :key="`land-${index}`"
              :item="land"
              type="land"
            />
          </template>

          <!-- Regular Room Cards -->
          <template v-else>
            <MoleculesListingRoomCard
              v-for="(item, index) in roomItems"
              :key="index"
              :item="item"
              :subtype="props.subtype"
              :show-floor="props.showFloor"
            />
          </template>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";

interface Props {
  title: string;
  type: "room" | "outdoorspace";
  subtype?: string; // For room types like "Bedroom", "Bathroom", etc.
  items:
    | Prisma.BedroomGetPayload<{ include: { media: true } }>[]
    | Prisma.BathroomGetPayload<{ include: { media: true } }>[]
    | Prisma.ReceptionGetPayload<{ include: { media: true } }>[]
    | Prisma.OtherRoomGetPayload<{ include: { media: true } }>[]
    | Prisma.KitchenGetPayload<{ include: { media: true } }>
    | Prisma.OutdoorSpaceGetPayload<{ include: { media: true; garden: true; yard: true; land: true } }>[]
    | null
    | undefined;
  showFloor?: boolean;
  variant?: "card" | "plain";
  totalArea?: number | null;
  hasGardens?: boolean;
  hasYards?: boolean;
  hasLand?: boolean;
  gardens?: Prisma.GardenGetPayload<{ include: { media: true } }>[] | null;
  yards?: Prisma.YardGetPayload<{ include: { media: true } }>[] | null;
  lands?: Prisma.LandGetPayload<{ include: { media: true } }>[] | null;
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

// Type guard for outdoor space
const outdoorSpaceItem = computed(() => {
  if (props.type !== 'outdoorspace' || itemsArray.value.length === 0) return null;
  return itemsArray.value[0] as Prisma.OutdoorSpaceGetPayload<{ include: { media: true; garden: true; yard: true; land: true } }>;
});

// Type guard for room items
const roomItems = computed(() => {
  if (props.type === 'outdoorspace') return [];
  return itemsArray.value as (
    | Prisma.BedroomGetPayload<{ include: { media: true } }>
    | Prisma.BathroomGetPayload<{ include: { media: true } }>
    | Prisma.ReceptionGetPayload<{ include: { media: true } }>
    | Prisma.OtherRoomGetPayload<{ include: { media: true } }>
    | Prisma.KitchenGetPayload<{ include: { media: true } }>
  )[];
});

// Calculate total count
const totalCount = computed(() => {
  if (props.type !== 'outdoorspace') return itemsArray.value.length;
  
  // For outdoor space: main card + gardens/yards/lands with additional details
  const gardensCount = props.gardens?.length || 0;
  const yardsCount = props.yards?.length || 0;
  const landsCount = props.lands?.length || 0;
  
  return 1 + gardensCount + yardsCount + landsCount;
});

// Section icon
const sectionIcon = computed(() => {
  if (props.type === 'outdoorspace') {
    return 'property/rear-garden';
  }
  // Use the existing room type icon logic based on subtype
  const dummyRoom = {};
  return getRoomTypeIcon(dummyRoom, props.subtype || props.title);
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
