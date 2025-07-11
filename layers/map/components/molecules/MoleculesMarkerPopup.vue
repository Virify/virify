<template>
  <div class="popup-wrapper">
    <div class="m-listing-card-map" :data-tier="isFeaturedOrPremium ? 'featured' : null" @click.stop>
      <div v-if="isFeaturedOrPremium" class="m-listing-card-map-featured-banner | body-sm font-bold">
        {{ isPremium ? 'Premium' : 'Featured' }}
      </div>
      <!-- Single image (no carousel) -->
      <div class="m-listing-card-map-image-container">
        <nuxt-img v-if="hasImage" :src="marker.image?.[0]?.image" alt="Listing image"
          class="m-listing-card-map-image" />
        <div class="m-listing-card-map-image-overlay">
          <div class="m-listing-card-map-image-actions">
            <button class="m-listing-card-map-icon-button" :class="{ 'is-active': marker.isFavorite }"
              @click="toggleFavourite">
              <AtomsIcon name="heart" icon="cards/favourite" class="icon-heart" />
            </button>
            <button class="m-listing-card-map-icon-button" :class="{ 'is-active': marker.hasNote }"
              @click="onNoteClick">
              <AtomsIcon name="edit" icon="cards/notes" class="icon-edit" />
            </button>
          </div>
        </div>
      </div>

      <div class="m-listing-card-map-content">
        <div class="m-listing-card-map-details">
          <!-- Header row with price (no price type) -->
          <div class="m-listing-card-map-header-row m-listing-card-map-price-group">
            <div class="m-listing-card-map-price">
              <span class="m-listing-card-map-price-amount | title-md">
                {{ formattedPrice }}
              </span>
            </div>
          </div>

          <!-- Property type and classification -->
          <div v-if="typeText" class="m-listing-card-map-subtitle | title-xs">
            {{ typeText }}
          </div>

          <!-- Features (only bedrooms and bathrooms) -->
          <div v-if="hasBedrooms || hasBathrooms" class="m-listing-card-map-features">
            <div v-if="hasBedrooms" class="m-listing-card-map-feature">
              <AtomsIcon name="bedrooms" icon="property/bedrooms" class="icon" />
              <p class="| body-sm">{{ marker.bedrooms }}</p>
            </div>
            <div v-if="hasBathrooms" class="m-listing-card-map-feature">
              <AtomsIcon name="bathrooms" icon="property/bathrooms" class="icon" />
              <p class="| body-sm">{{ marker.bathrooms }}</p>
            </div>
          </div>
        </div>

        <div class="m-listing-card-map-footer">
          <!-- Only view button (no enquiry) -->
          <div class="m-listing-card-map-actions">
            <nuxt-link :to="`/listing/${listingId}`" target="_blank" class="| button button-secondary body-sm">
              View
            </nuxt-link>
          </div>
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

const hasBedrooms = computed(() =>
  props.marker.bedrooms !== null && props.marker.bedrooms !== undefined
);
const hasBathrooms = computed(() =>
  props.marker.bathrooms !== null && props.marker.bathrooms !== undefined
);
const listingId = computed(() =>
  typeof props.marker.id === "number" ? props.marker.id : null
);

const typeText = computed(() =>
  [props.marker.propertyType, props.marker.classification].filter(Boolean).join(" - ")
);
const hasImage = computed(() =>
  props.marker.image &&
  props.marker.image[0] &&
  props.marker.image[0].image
);

const isFeatured = computed(() => props.marker.tier === 'FEATURED');
const isPremium = computed(() => props.marker.tier === 'PREMIUM');
const isFeaturedOrPremium = computed(() => isFeatured.value || isPremium.value);

// Event handlers
const { showNoteDialog } = useNotes();
const onNoteClick = () => {
  if (props.marker.id as number) {
    showNoteDialog(props.marker.id as number);
  }
};

const toggleFavourite = () => {
  // Add favourite toggle logic here
  console.log("Toggle favourite for:", props.marker.id);
};
</script>

<style lang="scss">
/* Style MapLibre popup to work with our design */
.maplibregl-popup-content {
  background: transparent !important;
  width: 280px !important;
  /* Match card width */
  max-width: 280px !important;
  /* Match card max-width */
  min-width: 280px !important;
  /* Ensure consistent width */
  padding: 0 !important;
  /* Remove default padding */
  margin: 0 !important;
  /* Remove default margin */
  border: none !important;
  /* Remove default border */
  border-radius: 0 !important;
  box-shadow: none !important;
  pointer-events: auto !important;
}

/* Style MapLibre's popup tip for all anchor positions */
.maplibregl-popup-anchor-top .maplibregl-popup-tip {
  border-bottom-color: var(--secondary-400) !important;
}

.maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
  border-top-color: var(--secondary-400) !important;
}

.maplibregl-popup-anchor-left .maplibregl-popup-tip {
  border-right-color: var(--secondary-400) !important;
}

.maplibregl-popup-anchor-right .maplibregl-popup-tip {
  border-left-color: var(--secondary-400) !important;
}

/* Hide diagonal anchor tips to force MapLibre to use straight anchors */
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

.m-listing-card-map {
  --card-padding: var(--size-12);
  --image-height: 140px;

  background-color: var(--background-200);
  border: var(--size-4) solid var(--secondary-400);
  border-radius: calc(var(--border-radius-2xl) + var(--size-2));
  display: flex;
  flex-direction: column;
  max-width: 280px;
  width: 280px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 0;
  padding: 0;


  &[data-tier='featured'] {
    border-color: var(--secondary-400);
    border-width: var(--size-4);
    padding: 0;

    .m-listing-card-map-image-container {
      border-radius: calc(var(--border-radius-2xl) - var(--size-1));
    }

    .m-listing-card-map-content {
      padding: var(--card-padding);
    }

    .m-listing-card-map-featured-banner {
      background-color: var(--secondary-400);
      border-radius: calc(var(--border-radius-2xl) - var(--size-4)) 0 var(--border-radius-lg) 0;
      color: var(--monochrome-900);
      padding: var(--size-6) var(--size-16);
      position: absolute;
      top: 0;
      left: -2px;
      z-index: 3;
    }
  }

  .m-listing-card-map-image-container {
    border-radius: var(--border-radius-2xl) var(--border-radius-2xl) 0 0;
    overflow: hidden;
    position: relative;
    height: var(--image-height);
    z-index: 1;
    margin: 0;
  }

  .m-listing-card-map-image {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .m-listing-card-map-image-overlay {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }

  .m-listing-card-map-image-actions {
    background-color: var(--secondary-400);
    border-radius: var(--border-radius-pill);
    display: flex;
    gap: var(--size-4);
    padding: var(--size-4) var(--size-8);
    position: absolute;
    top: var(--size-12);
    right: var(--size-12);
  }

  .m-listing-card-map-icon-button {
    align-items: center;
    background-color: transparent;
    border: none;
    color: var(--monochrome-100);
    cursor: pointer;
    display: flex;
    font-size: var(--font-lg);
    height: var(--size-24);
    justify-content: center;
    width: var(--size-24);
    transition: color 0.2s ease-in-out;

    .icon {
      transition: fill 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    .icon-heart {
      fill: transparent;
    }

    &.is-active {

      .icon-heart,
      .icon-edit {
        color: var(--monochrome-900);
      }

      .icon-heart {
        fill: var(--monochrome-900);
      }
    }
  }

  .m-listing-card-map-content {
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--card-padding);
    flex: 1;
  }

  .m-listing-card-map-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .m-listing-card-map-price-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .m-listing-card-map-price-amount {
    color: var(--secondary-500);
  }

  .m-listing-card-map-type-indicator {
    min-width: 40px;
    text-align: center;
    background-color: var(--background-300);
    padding: var(--size-4) var(--size-8);
    border-radius: var(--border-radius-lg);
  }

  .m-listing-card-map-title {
    color: var(--text-primary);
    margin: 0;
  }

  .m-listing-card-map-subtitle {
    margin: 0;
    color: var(--text-secondary);
  }

  .m-listing-card-map-features {
    display: flex;
    gap: var(--size-8);
    list-style: none;
    margin-bottom: var(--size-12);
    padding: 0;
  }

  .m-listing-card-map-feature {
    align-items: center;
    display: flex;
    font-weight: var(--font-semibold);
    gap: var(--size-4);

    .icon {
      font-size: var(--font-lg);
      color: var(--text-secondary);
    }
  }

  .m-listing-card-map-actions {
    width: 100%;

    .button {
      width: 100%;
      padding: var(--size-8);
      border-radius: var(--border-radius-lg);
      border-color: var(--secondary-400);
      text-align: center;
      text-decoration: none;
      display: inline-block;
    }
  }
}
</style>