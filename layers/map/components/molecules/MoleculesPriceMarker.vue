<template>
  <div class="price-marker-container">
    <!-- SVG Marker Shape -->
    <!-- Dynamic marker based on favorite status and tier -->
    <AtomsIcon :icon="markerIcon" :class="markerClass" />


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
}

const props = defineProps<MarkerProps>();

// Remove reactive favorite status - use prop instead

// Format price as £XXk if >= 10000, otherwise just format with commas
const priceDisplay = computed(() => {
  if (props.price === null || props.price === undefined) {
    return "";
  }
  return props.price >= 10000
    ? `£${Math.round(props.price / 1000)}k`
    : `£${props.price.toLocaleString()}`;
});

// Computed marker icon based on favorite status and tier
const markerIcon = computed(() => {
  // if (props.isFavorite) return "map/fav-marker";

  switch (props.tier) {
    case "PREMIUM": return "map/marker-premium";
    case "FEATURED": return "map/marker-featured";
    case "BASIC":
    default: return "map/marker-basic";
  }
});

// Computed marker class based on favorite status and tier
const markerClass = computed(() => {
  // if (props.isFavorite) return "marker-shape heart-marker";
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
