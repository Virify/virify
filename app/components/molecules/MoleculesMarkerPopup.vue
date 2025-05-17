<template>
  <div class="marker-popup">
    <!-- Property image -->
    <div v-if="hasImage" class="marker-popup-image-container">
      <img 
        class="marker-popup-image" 
        :src="markerData.image && markerData.image[0] ? markerData.image[0].image : ''" 
        :alt="markerData.image && markerData.image[0] && markerData.image[0].metadata ? markerData.image[0].metadata : (markerData.title || 'Property image')" 
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
    <div v-if="propertyId !== null" class="marker-popup-actions">
      <NuxtLink :to="`/listing/${propertyId}`" class="marker-popup-view-link">
        View Listing
      </NuxtLink>
      
      <!-- Notes button -->
      <div class="marker-popup-notes-button-container" :data-property-id="propertyId">
        <button 
          type="button" 
          role="switch" 
          aria-label="Add/Edit Notes" 
          class="marker-popup-notes-button note-button" 
          :class="{ 'has-note': markerData.hasNote }"
          @click.stop.prevent="onNoteClick"
        >
          <div class="note-icon-wrapper">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              class="note-button-icon"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        </button>
      </div>
      
      <!-- Favorite button -->
      <div class="marker-popup-favorite-button-container" :data-property-id="propertyId">
        <button 
          type="button" 
          role="switch" 
          aria-label="Add to favourites" 
          class="marker-popup-favorite-button a-favourite-button" 
          :class="{ 'selected': markerData.isFavorite }"
          @click.stop.prevent="onFavoriteClick"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            :fill="markerData.isFavorite ? 'currentColor' : 'none'" 
            stroke="currentColor" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            class="marker-popup-button-icon"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MapMarker } from '../../../shared/types/map-coordinates';

const props = defineProps<{ 
  markerData: MapMarker;
  onNoteClick?: (id: number) => void;
  onFavoriteClick?: (id: number) => void;
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
const onNoteClick = () => {
  if (propertyId.value && props.onNoteClick) {
    // Only call the provided handler, no local state changes here
    props.onNoteClick(propertyId.value);
  }
};

const onFavoriteClick = () => {
  if (propertyId.value && props.onFavoriteClick) {
    // Only call the provided handler, no local state changes here
    props.onFavoriteClick(propertyId.value);
  }
};
</script>

<style scoped>
/* Main popup container */

.maplibregl-popup-content {
  width: 100%;
}
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

.marker-popup-notes-button,
.marker-popup-favorite-button {
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

.marker-popup-notes-button:hover,
.marker-popup-favorite-button:hover {
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