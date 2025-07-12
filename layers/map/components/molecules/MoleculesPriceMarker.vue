<template>
  <div class="price-marker-container">
    <!-- SVG Marker Shape -->
    <!-- Dynamic marker based on favorite status and tier -->
    <AtomsIcon :icon="markerIcon" :class="markerClass" />

    <!-- Favorite indicator -->
    <div v-if="isCurrentlyFavorite" class="favorite-indicator">
      <AtomsIcon icon="heart" class="favorite-icon" />
    </div>

    <!-- Content overlay -->
    <div class="price-marker-content">
      <span class="price-marker-price | body-xs font-semibold">{{ priceDisplay }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MarkerProps {
  id: string | number | null;
  price: number | null;
  hasNote?: boolean | null;
  isFavorite?: boolean | null;
  tier?: 'FEATURED' | 'BASIC' | 'PREMIUM';
  priceType?: string | null;
}

const props = defineProps<MarkerProps>();

// Use composables for live favorite status (separate from props to avoid re-renders)
const { isFavourite } = useFavourites();

// Get live favorite status
const isCurrentlyFavorite = computed(() => isFavourite(props.id as number));

// Format price based on property type (sale vs rental)
const priceDisplay = computed(() => {
  if (props.price === null || props.price === undefined) {
    return "";
  }
  
  // Check if it's a rental property based on priceType
  const isRental = props.priceType && 
    (props.priceType.toLowerCase().includes('month') || 
     props.priceType.toLowerCase().includes('week') || 
     props.priceType.toLowerCase().includes('pcm') ||
     props.priceType.toLowerCase().includes('pw'));
  
  if (isRental) {
    // For rentals, just remove pennies (round to nearest pound)
    return `£${Math.round(props.price).toLocaleString()}`;
  } else {
    // For sales, use higher threshold (£10000+ becomes £10k)
    return props.price >= 10000
      ? `£${Math.round(props.price / 1000)}k`
      : `£${props.price.toLocaleString()}`;
  }
});

// Computed marker icon based on favorite status and tier
const markerIcon = computed(() => {

  switch (props.tier) {
    case "PREMIUM": return "map/marker-premium";
    case "FEATURED": return "map/marker-featured";
    case "BASIC":
    default: return "map/marker-basic";
  }
});

// Computed marker class based on favorite status and tier
const markerClass = computed(() => {
  if (props.tier === "PREMIUM") return "marker-shape teardrop-marker premium-marker";
  return "marker-shape teardrop-marker";
});

</script>

<style scoped>
/* Container for the SVG marker */
.price-marker-container {
  position: relative;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Ensure the bottom of the container is the precise anchor point */
  transform-origin: center bottom;
  /* Inherit z-index from parent wrapper for proper stacking */
  z-index: inherit;
  /* Make container non-clickable, only the actual marker content should be clickable */
  pointer-events: none;
}

.marker-shape {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 70px;
  color: var(--monochrome-300);
  /* Allow clicking on the actual marker shape */
  pointer-events: auto;
}

.marker-shape.heart-marker {
  color: var(--favourite-colour);
}

/* Content overlay positioned on top of the SVG */
.price-marker-content {
  position: absolute;
  top: 34%;
  /* Adjusted to center in the circular part of the teardrop */
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--monochrome-900);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  /* Allow clicking on the price content */
  pointer-events: auto;
  font: inherit;
}

/* Favorite indicator */
.favorite-indicator {
  position: absolute;
  top: var(--size-4);
  right: var(--size-4);
  z-index: 2;
  background-color: var(--favourite-colour);
  border-radius: 50%;
  width: var(--size-16);
  height: var(--size-16);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 var(--size-2) var(--size-4) rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.favorite-icon {
  color: var(--monochrome-100);
  font-size: var(--font-xs);
}
</style>
