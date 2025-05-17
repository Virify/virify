<template>
  <div class="marker-popup" @click.stop>
    <!-- Property image -->
    <div v-if="hasImage" class="marker-popup-image-container">
      <img 
        class="marker-popup-image" 
        :src="markerData.image?.[0]?.image" 
        :alt="markerData.image?.[0]?.metadata || markerData.title || 'Property image'"
        @click.stop 
      />
    </div>
    
    <!-- Title -->
    <strong v-if="markerData.title" class="marker-popup-title">{{ markerData.title }}</strong>
    
    <!-- Address -->
    <div v-if="addressParts.length > 0" class="marker-popup-address">
      {{ addressParts.join(', ') }}
    </div>
    
    <!-- Info container: price & details -->
    <div class="marker-popup-info-container">
      <!-- Price column -->
      <div class="marker-popup-price-column">
        <div v-if="markerData.price !== null && markerData.price !== undefined" class="marker-popup-price">
          £{{ markerData.price.toLocaleString() }}
        </div>
        <div v-if="markerData.priceType" class="marker-popup-price-type">
          {{ priceTypeFormatted }}
        </div>
      </div>
      
      <!-- Details column -->
      <div class="marker-popup-details-column">
        <div v-if="typeText" class="marker-popup-property-type">{{ typeText }}</div>
        <div v-if="hasBedrooms || hasBathrooms" class="marker-popup-features">
          <span v-if="hasBedrooms" class="marker-popup-bedrooms">
            {{ markerData.bedrooms }} bed{{ markerData.bedrooms !== 1 ? 's' : '' }}
          </span>
          <span v-if="hasBedrooms && hasBathrooms"> • </span>
          <span v-if="hasBathrooms" class="marker-popup-bathrooms">
            {{ markerData.bathrooms }} bath{{ markerData.bathrooms !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Action buttons -->
    <div v-if="propertyId !== null" class="marker-popup-actions" @click.stop>
      <NuxtLink :to="`/listing/${propertyId}`" class="marker-popup-view-link" @click.stop>
        View Listing
      </NuxtLink>
      
      <!-- Notes button -->
      <div class="marker-popup-notes-button-container">
        <button 
          type="button" 
          role="switch" 
          aria-label="Add/Edit Notes" 
          class="marker-popup-notes-button note-button" 
          :class="{ 'has-note': markerData.hasNote }"
          @click.stop="onNoteClick"
        >
          <AtomsIcon icon="cards/notes" class="note-button-icon" />
        </button>
      </div>
      
      <!-- Favorite button -->
      <AtomsFavouriteButton 
        :property-id="propertyId" 
        class="marker-popup-favorite-button"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '../../../shared/types/map-coordinates';
import { useNotes } from '~/composables/useNotes';

const props = defineProps<{ 
  markerData: MapMarker;
}>();

// Computed properties
const hasBedrooms = computed(() => 
  props.markerData.bedrooms !== null && props.markerData.bedrooms !== undefined
);
const hasBathrooms = computed(() => 
  props.markerData.bathrooms !== null && props.markerData.bathrooms !== undefined
);
const propertyId = computed(() => 
  typeof props.markerData.id === "number" ? props.markerData.id : null
);
const addressParts = computed(() => 
  props.markerData.address ? 
  [props.markerData.address.street, props.markerData.address.city, props.markerData.address.postcode].filter(Boolean) : 
  []
);
const typeText = computed(() => 
  [props.markerData.propertyType, props.markerData.classification].filter(Boolean).join(" - ")
);
const priceTypeFormatted = computed(() => 
  props.markerData.priceType ? props.markerData.priceType.replace(/_/g, " ").toLowerCase() : ''
);
const hasImage = computed(() => 
  props.markerData.image && 
  props.markerData.image[0] && 
  props.markerData.image[0].image
);

// Event handlers
const { showNoteDialog } = useNotes();
const onNoteClick = () => {
  if (propertyId.value) {
    showNoteDialog(propertyId.value);
  }
};
</script>

<style scoped>
/* Override MapTiler popup styles */
:global(.maplibregl-popup-content) {
  padding: 0;
  background: none;
  border-radius: 0;
  box-shadow: none;
}

:global(.maplibregl-popup-tip) {
  display: none;
}

/* Main popup styles */
.marker-popup {
  padding: 0;
  max-width: 325px !important;
  /* Adjusted width */
  font-family: var(--font-family, system-ui, sans-serif);
  border-radius: var(--border-radius-md, 8px);
  overflow: hidden;
  width: 325px !important;
  /* Force the width */
  background-color: var(--background-100);
  color: var(--text-primary);
}

.marker-popup-image-container {
  width: 100%;
  height: 200px;
  /* Increased from 160px to be proportional with the wider popup */
  overflow: hidden;
  position: relative;
}

.marker-popup-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.marker-popup-image:hover {
  transform: scale(1.05);
}

.marker-popup-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
  color: var(--text-primary);
  padding: 12px 12px 0;
}

.marker-popup-address {
  font-size: 12px;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-style: italic;
  padding: 0 12px;
}

.marker-popup-info-container {
  display: flex;
  justify-content: space-between;
  padding: 0 12px;
  margin: 10px 0;
  gap: 15px;
}

.marker-popup-price-column {
  flex: 1;
}

.marker-popup-details-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.marker-popup-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--secondary-500);
  margin-bottom: 2px;
}

.marker-popup-price-type {
  font-size: 11px;
  color: var(--text-secondary);
  text-transform: capitalize;
}

.marker-popup-property-type {
  font-size: 13px;
  margin-bottom: 4px;
  color: var(--text-primary);
}

.marker-popup-features {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 0;
}

.marker-popup-actions {
  display: flex;
  gap: 8px;
  margin: 10px 0 0;
  padding: 0 12px 12px;
}

.marker-popup-view-link {
  display: block;
  padding: 8px 12px;
  background-color: var(--secondary-500);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius-sm, 4px);
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  flex-grow: 1;
}

.marker-popup-view-link:hover {
  background-color: var(--secondary-600);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--shadow-subtle, rgba(0, 0, 0, 0.2));
}

.marker-popup-notes-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--background-200);
  border: none;
  border-radius: var(--border-radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.marker-popup-notes-button:hover {
  background-color: var(--background-300);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px var(--shadow-subtle, rgba(0, 0, 0, 0.2));
}

/* Selected state for favorites button */
.marker-popup-favorite-button.selected {
  background-color: var(--pink-100);
}

.marker-popup-favorite-button.selected svg {
  fill: var(--pink-500);
  color: var(--pink-500);
}

.marker-popup-button-icon,
.note-button-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

/* Note button styles */
.note-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Has note styling */
.marker-popup-notes-button.has-note {
  background-color: var(--background-200);
}

.marker-popup-notes-button.has-note svg {
  color: var(--secondary-600);
}

/* Has note animation (same as original component) */
.marker-popup-notes-button.has-note .note-button-confetti {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}

.marker-popup-notes-button-container,
.marker-popup-favorite-button-container {
  position: relative;
}

</style>