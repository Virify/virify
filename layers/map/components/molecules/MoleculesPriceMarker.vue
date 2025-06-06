<template>
  <div class="price-marker-container">
    <!-- SVG Marker Shape -->
    <!-- Regular teardrop marker -->
    <AtomsIcon 
      v-if="isFavorite === false || isFavorite === null"
      icon="map/marker" 
      class="marker-shape teardrop-marker"
    />
    
    <!-- Heart marker for favorites -->
    <AtomsIcon 
      v-else
      icon="map/fav-marker" 
      class="marker-shape heart-marker"
    />
    
    <!-- Content overlay -->
    <div class="price-marker-content">
      <span class="price-marker-price | body-xs font-bold">{{ priceDisplay }}</span>
      <div v-if="hasNote && !isFavorite" class="marker-note-indicator">
        <AtomsIcon icon="cards/notes" class="note-button-icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MarkerProps {
  price: number | null;
  hasNote?: boolean | null;
  isFavorite?: boolean | null;
}

const props = defineProps<MarkerProps>();

// Debug log to see what's happening
console.log('MoleculesPriceMarker props:', { 
  price: props.price, 
  hasNote: props.hasNote, 
  isFavorite: props.isFavorite,
  isFavoriteType: typeof props.isFavorite,
  isFavoriteString: String(props.isFavorite)
});

// Format price as £XXk if >= 10000, otherwise just format with commas
const priceDisplay = computed(() => {
  if (props.price === null || props.price === undefined) {
    return "";
  }
  return props.price >= 10000 
    ? `£${Math.round(props.price / 1000)}k` 
    : `£${props.price.toLocaleString()}`;
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
}

.marker-shape {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  height: 70px;
  color: var(--secondary-400);
}

.marker-shape.heart-marker {
  color: var(--favourite-colour);
}

.teardrop-marker {
  transform: rotate(180deg);
}

/* Content overlay positioned on top of the SVG */
.price-marker-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%); /* Adjusted for new SVG positioning */
  color: var(--monochrome-100);
  z-index: 1;
}
</style>
