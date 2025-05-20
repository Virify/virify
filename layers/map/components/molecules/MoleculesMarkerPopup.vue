<template>
  <div class="marker-popup" @click.stop>
    <!-- Property image -->
    <div v-if="hasImage" class="marker-popup-image-container">
      <img class="marker-popup-image" :src="marker.image?.[0]?.image"
        :alt="marker.image?.[0]?.metadata || marker.title || 'Property image'" @click.stop />
    </div>

    <!-- Title -->
    <strong v-if="marker.title" class="marker-popup-title">{{ marker.title }}</strong>

    <!-- Address -->
    <div v-if="addressParts.length > 0" class="marker-popup-address">
      {{ addressParts.join(', ') }}
    </div>

    <!-- Info container: price & details -->
    <div class="marker-popup-info-container">
      <!-- Price column -->
      <div class="marker-popup-price-column">
        <div v-if="marker.price !== null && marker.price !== undefined" class="marker-popup-price">
          £{{ marker.price.toLocaleString() }}
        </div>
        <div v-if="marker.priceType" class="marker-popup-price-type">
          {{ priceTypeFormatted }}
        </div>
      </div>

      <!-- Details column -->
      <div class="marker-popup-details-column">
        <div v-if="typeText" class="marker-popup-property-type">{{ typeText }}</div>
        <div v-if="hasBedrooms || hasBathrooms" class="marker-popup-features">
          <span v-if="hasBedrooms" class="marker-popup-bedrooms">
            {{ marker.bedrooms }} bed{{ marker.bedrooms !== 1 ? 's' : '' }}
          </span>
          <span v-if="hasBedrooms && hasBathrooms"> • </span>
          <span v-if="hasBathrooms" class="marker-popup-bathrooms">
            {{ marker.bathrooms }} bath{{ marker.bathrooms !== 1 ? 's' : '' }}
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
        <button type="button" role="switch" aria-label="Add/Edit Notes" class="marker-popup-notes-button note-button"
          :class="{ 'has-note': marker.hasNote }" @click.stop="onNoteClick">
          <AtomsIcon icon="cards/notes" class="note-button-icon" />
        </button>
      </div>

      <!-- Favorite button -->
      <AtomsFavouriteButton :property-id="propertyId" class="marker-popup-favorite-button" @click.stop />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MapMarker } from '~~/shared/types/map-coordinates';
import { useNotes } from '~/composables/useNotes';

const props = defineProps<{
  marker: MapMarker;
}>();

// Computed properties
const hasBedrooms = computed(() =>
  props.marker.bedrooms !== null && props.marker.bedrooms !== undefined
);
const hasBathrooms = computed(() =>
  props.marker.bathrooms !== null && props.marker.bathrooms !== undefined
);
const propertyId = computed(() =>
  typeof props.marker.id === "number" ? props.marker.id : null
);
const addressParts = computed(() =>
  props.marker.address ?
    [props.marker.address.street, props.marker.address.city, props.marker.address.postcode].filter(Boolean) :
    []
);
const typeText = computed(() =>
  [props.marker.propertyType, props.marker.classification].filter(Boolean).join(" - ")
);
const priceTypeFormatted = computed(() =>
  props.marker.priceType ? props.marker.priceType.replace(/_/g, " ").toLowerCase() : ''
);
const hasImage = computed(() =>
  props.marker.image &&
  props.marker.image[0] &&
  props.marker.image[0].image
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
  max-width: 250px !important; /* Reduced width */
  font-family: var(--font-family, system-ui, sans-serif);
  border-radius: var(--border-radius-md, 8px);
  overflow: hidden;
  width: 250px !important; /* Reduced width */
  background-color: var(--background-100);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.marker-popup-image-container {
  width: 100%;
  height: 140px; /* Reduced height */
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
  font-size: 14px; /* Reduced font size */
  font-weight: 600;
  display: block;
  margin-bottom: 4px; /* Reduced margin */
  color: var(--text-primary);
  padding: 10px 10px 0; /* Reduced padding */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.marker-popup-address {
  font-size: 11px; /* Reduced font size */
  margin-bottom: 8px; /* Reduced margin */
  color: var(--text-secondary);
  font-style: italic;
  padding: 0 10px; /* Reduced padding */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.marker-popup-info-container {
  display: flex;
  justify-content: space-between;
  padding: 0 10px; /* Reduced padding */
  margin: 6px 0; /* Reduced margin */
  gap: 8px; /* Reduced gap */
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
  font-size: 16px; /* Reduced font size */
  font-weight: 700;
  color: var(--secondary-500);
  margin-bottom: 0;
}

.marker-popup-price-type {
  font-size: 10px; /* Reduced font size */
  color: var(--text-secondary);
  text-transform: capitalize;
}

.marker-popup-property-type {
  font-size: 12px; /* Reduced font size */
  margin-bottom: 2px; /* Reduced margin */
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.marker-popup-features {
  font-size: 11px; /* Reduced font size */
  color: var(--text-secondary);
  margin-bottom: 0;
}

.marker-popup-actions {
  display: flex;
  gap: 6px; /* Reduced gap */
  margin: 8px 0 0; /* Reduced margin */
  padding: 0 10px 10px; /* Reduced padding */
}

.marker-popup-view-link {
  display: block;
  padding: 6px 10px; /* Reduced padding */
  background-color: var(--secondary-500);
  color: white;
  text-decoration: none;
  border-radius: var(--border-radius-sm, 4px);
  text-align: center;
  font-size: 12px; /* Reduced font size */
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
  width: 30px; /* Reduced size */
  height: 30px; /* Reduced size */
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
  width: 16px; /* Reduced size */
  height: 16px; /* Reduced size */
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