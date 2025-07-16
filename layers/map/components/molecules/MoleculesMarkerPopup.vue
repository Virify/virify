<template>
  <div class="popup-wrapper">
    <div
      class="listing-card"
      :class="{
        'listing-card--featured': isFeatured,
        'listing-card--premium': isPremium,
      }"
      @click.stop
    >
      <!-- Banner -->
      <div
        v-if="isFeaturedOrPremium"
        class="listing-card__banner | body-sm font-bold"
      >
        {{ isPremium ? "Premium" : "Featured" }}
      </div>
      <!-- Image -->
      <div class="listing-card__image-container">
        <nuxt-img
          v-if="hasImage"
          :src="marker.image?.[0]?.image"
          alt="Listing image"
          class="listing-card__image"
        />
      </div>
      <!-- Content -->
      <div class="listing-card__content">
        <!-- Price and Actions -->
        <div class="listing-card__header">
          <div class="listing-card__price | title-md">
            <p class="listing-card__price-value">{{ formattedPrice }}</p>
            <p class="listing-card__price-type | body-xs">
              {{ formattedPriceType }}
            </p>
          </div>
          <div class="listing-card__actions">
            <AtomsFavouriteButton
              :listing-id="(marker.id as number)"
              :confirm-removal="false"
            />
            <AtomsNoteButton :listing-id="(marker.id as number)" />
          </div>
        </div>

        <!-- Property type -->
        <div v-if="typeText" class="listing-card__type | title-xs">
          {{ typeText }}
        </div>

        <!-- Features -->
        <div v-if="hasBedrooms || hasBathrooms" class="listing-card__features">
          <div
            v-if="hasBedrooms"
            class="listing-card__feature | font-semibold"
            :aria-label="`${marker.bedrooms} bedrooms`"
            :title="`${marker.bedrooms} bedrooms`"
          >
            <AtomsIcon
              name="bedrooms"
              icon="property/bedrooms"
              aria-hidden="true"
            />
            <span class="body-sm">{{ marker.bedrooms }}</span>
          </div>
          <div
            v-if="hasBathrooms"
            class="listing-card__feature | body-sm font-semibold"
            :aria-label="`${marker.bathrooms} bathrooms`"
            :title="`${marker.bathrooms} bathrooms`"
          >
            <AtomsIcon
              name="bathrooms"
              icon="property/bathrooms"
              aria-hidden="true"
            />
            <span class="body-sm">{{ marker.bathrooms }}</span>
          </div>
          <div
            v-if="hasReceptions"
            class="listing-card__feature | body-sm font-semibold"
            :aria-label="`${marker.receptions} receptions`"
            :title="`${marker.receptions} receptions`"
          >
            <AtomsIcon
              name="receptions"
              icon="property/receptions"
              aria-hidden="true"
            />
            <span class="body-sm">{{ marker.receptions }}</span>
          </div>
        </div>

        <!-- View button -->
        <div class="listing-card__footer">
          <nuxt-link
            :to="`/listing/${listingId}`"
            target="_blank"
            class="listing-card__view-btn | button button-secondary body-sm"
            aria-label="View property details"
            title="View property details"
          >
            View
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  marker: MapMarker;
}>();

// Computed properties

const formattedPrice = computed(() => {
  return `£${parseInt(String(props.marker.price)).toLocaleString()}`;
});

const formattedPriceType = computed(() => {
  if (!props.marker.priceType) return "";
  // Capitalize the first letter of priceType and replace underscores with spaces
  return convertEnumToString(props.marker.priceType).toLowerCase();
});

const hasBedrooms = computed(
  () => props.marker.bedrooms !== null && props.marker.bedrooms !== undefined
);
const hasBathrooms = computed(
  () => props.marker.bathrooms !== null && props.marker.bathrooms !== undefined
);
const hasReceptions = computed(
  () =>
    props.marker.receptions !== null && props.marker.receptions !== undefined
);
const listingId = computed(() =>
  typeof props.marker.id === "number" ? props.marker.id : null
);

const typeText = computed(() =>
  [props.marker.propertyType, props.marker.classification]
    .filter(Boolean)
    .join(" - ")
);
const hasImage = computed(
  () =>
    props.marker.image && props.marker.image[0] && props.marker.image[0].image
);

const isFeatured = computed(() => props.marker.tier === "FEATURED");
const isPremium = computed(() => props.marker.tier === "PREMIUM");
const isFeaturedOrPremium = computed(() => isFeatured.value || isPremium.value);

// Event handlers - removed as AtomsFavouriteButton and AtomsNoteButton handle this internally

onMounted(() => {
  // Ensure the marker is rendered correctly on mount
  console.log("Marker mounted:", props.marker);
});
</script>

<style lang="scss">
/* MapLibre popup overrides */
.maplibregl-popup-content {
  background: transparent !important;
  width: var(--size-280) !important;
  max-width: var(--size-280) !important;
  min-width: var(--size-280) !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  pointer-events: auto !important;
  transform: translateY(-2px) !important;
}

.maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: var(--monochrome-300) !important;
}

.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--monochrome-300) !important;
}

.maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: var(--monochrome-300) !important;
}

.maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: var(--monochrome-300) !important;
}

/* Featured popup tip colors */
.maplibregl-popup:has(.listing-card--featured).maplibregl-popup-anchor-top
  .maplibregl-popup-tip {
  border-bottom-color: var(--secondary-400) !important;
}

.maplibregl-popup:has(.listing-card--featured).maplibregl-popup-anchor-bottom
  .maplibregl-popup-tip {
  border-top-color: var(--secondary-400) !important;
}

.maplibregl-popup:has(.listing-card--featured).maplibregl-popup-anchor-left
  .maplibregl-popup-tip {
  border-right-color: var(--secondary-400) !important;
}

.maplibregl-popup:has(.listing-card--featured).maplibregl-popup-anchor-right
  .maplibregl-popup-tip {
  border-left-color: var(--secondary-400) !important;
}

/* Premium popup tip colors - specific to each anchor position */
.maplibregl-popup:has(.listing-card--premium).maplibregl-popup-anchor-top
  .maplibregl-popup-tip {
  border-bottom-color: var(--primary-400) !important;
}

.maplibregl-popup:has(.listing-card--premium).maplibregl-popup-anchor-bottom
  .maplibregl-popup-tip {
  border-top-color: var(--primary-400) !important;
}

.maplibregl-popup:has(.listing-card--premium).maplibregl-popup-anchor-left
  .maplibregl-popup-tip {
  border-right-color: var(--primary-400) !important;
}

.maplibregl-popup:has(.listing-card--premium).maplibregl-popup-anchor-right
  .maplibregl-popup-tip {
  border-left-color: var(--primary-400) !important;
}

.maplibregl-popup-anchor-top-left .maplibregl-popup-tip,
.maplibregl-popup-anchor-top-right .maplibregl-popup-tip,
.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip,
.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip {
  display: none !important;
}

.maplibregl-popup-close-button {
  display: none !important;
}

/* Target the popup element directly to override inline styles */
.maplibregl-popup[style] {
  max-width: none !important;
}

.maplibregl-popup-content[style] {
  max-width: 280px !important;
  width: 280px !important;
}

.popup-wrapper {
  position: relative;
  background: transparent;
  padding: 0;
  margin: 0;
  border: none;
  box-shadow: none;
}

/* ============================================
   CARD BASE STYLES
   ============================================ */

.listing-card {
  background-color: var(--background-200);
  border: var(--size-2) solid var(--monochrome-300);
  border-radius: var(--border-radius-2xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  margin: 0;
  max-width: 280px;
  padding: 0;
  position: relative;
  width: 280px;
}

/* ============================================
   CARD TIER VARIANTS
   ============================================ */

.listing-card--featured {
  border-color: var(--secondary-400);
}

.listing-card--premium {
  background: var(--monochrome-300);
  border-color: var(--primary-400);
  color: var(--monochrome-100);
}

/* ============================================
   BANNER
   ============================================ */

.listing-card__banner {
  background-color: var(--secondary-400);
  border-radius: calc(var(--border-radius-2xl) - 4px) 0 var(--border-radius-lg)
    0;
  color: var(--monochrome-900);
  left: -2px;
  padding: 6px 16px;
  position: absolute;
  top: 0;
  z-index: 3;
}

.listing-card--featured .listing-card__banner {
  left: -1px;
  top: -1px;
}

.listing-card--premium .listing-card__banner {
  background-color: var(--primary-400);
  color: var(--monochrome-300);
  left: -1px;
  top: -1px;
}

/* ============================================
   IMAGE
   ============================================ */

.listing-card__image-container {
  border-radius: calc(var(--border-radius-2xl) - var(--size-2))
    calc(var(--border-radius-2xl) - var(--size-2)) 0 0;
  height: 140px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.listing-card__image {
  height: 100%;
  object-fit: cover;
  width: 100%;
}

/* ============================================
   CONTENT AREA
   ============================================ */

.listing-card__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--size-4);
  padding: var(--size-12);
}

/* Header with price and actions */
.listing-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

/* Price */
.listing-card__price {
  color: var(--secondary-500);
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.listing-card__price-type {
  margin-top: 0;
  color: var(--monochrome-600);
  text-transform: capitalize;
}

.listing-card--premium .listing-card__price {
  color: var(--primary-500);
}

.listing-card--premium .listing-card__type {
  color: var(--monochrome-900);
}

/* Features */
.listing-card__features {
  display: flex;
  gap: var(--size-8);
  margin-bottom: var(--size-8);
}

.listing-card__feature {
  align-items: center;
  color: var(--text-color);
  font-size: var(--font-2xl);
  display: flex;
  gap: var(--size-4);
}

.listing-card--premium .listing-card__feature {
  color: var(--monochrome-900);
}

.listing-card__feature svg {
  color: var(--text-secondary);
}

.listing-card--premium .listing-card__feature svg {
  color: var(--monochrome-900);
}

/* ============================================
   ACTION BUTTONS (HEART/NOTES)
   ============================================ */

.listing-card__actions {
  background-color: var(--secondary-400);
  border-radius: var(--border-radius-pill);
  display: flex;
  gap: var(--size-8);
  padding: var(--size-8);
}

.listing-card--premium .listing-card__actions {
  background-color: var(--primary-400);
}

.listing-card__actions .a-favourite-button,
.listing-card__actions .note-button {
  height: var(--size-24);
  width: var(--size-24);
}

.listing-card__actions .note-button.has-note::after {
  top: 0;
}

/* ============================================
   VIEW BUTTON
   ============================================ */

.listing-card__footer {
  margin-top: auto;
}

.listing-card__view-btn {
  background: var(--secondary-400);
  border: none;
  border-radius: var(--border-radius-lg);
  color: var(--monochrome-900);
  display: inline-block;
  padding: var(--size-8);
  text-align: center;
  text-decoration: none;
  transition: none;
  width: 100%;
}

.listing-card__view-btn:hover {
  background: var(--secondary-400);
  color: var(--monochrome-900);
}

.listing-card--premium .listing-card__view-btn {
  background: var(--primary-400);
  color: var(--monochrome-300);
}

.listing-card--featured .listing-card__view-btn:hover {
  background: var(--secondary-400);
  color: var(--monochrome-900);
}
</style>
