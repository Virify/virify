<template>
  <div class="listing-card" :class="{
    'listing-card--featured': isFeatured,
    'listing-card--premium': isPremium,
  }" @click.stop>
    <!-- Banner -->
    <div v-if="isFeaturedOrPremium" class="listing-card__banner | body-sm font-bold">
      {{ isPremium ? "Premium" : "Featured" }}
    </div>
    <!-- Image -->
    <div class="listing-card__image-container">
      <nuxt-img v-if="hasImage" :src="listing.image?.[0]?.image" alt="Listing image" class="listing-card__image" />
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
        <div class="m-listing-card-image-actions" @click.stop>
          <AtomsFavouriteButton :listing-id="Number(listing.id)"
            class="a-favourite-button" />
          <AtomsNoteButton :listing-id="Number(listing.id)" class="note-button" />
        </div>
      </div>

      <!-- Address -->
      <div v-if="address" class="listing-card__address | body-xs font-semibold">
        <span v-if="address.street">{{ address.street }},&nbsp;</span>
        <span v-if="address.city">{{ address.city }},&nbsp;</span>
        <span v-if="address.postcode">{{ address.postcode }}</span>
      </div>

      <!-- Property type -->
      <div v-if="typeText" class="listing-card__type | body-xs">
        {{ typeText }}
      </div>

      <!-- Features -->
      <div v-if="hasBedrooms || hasBathrooms" class="listing-card__features">
        <div v-if="hasBedrooms" class="listing-card__feature | font-semibold"
          :aria-label="`${listing.bedrooms} bedrooms`" :title="`${listing.bedrooms} bedrooms`">
          <AtomsIcon name="bedrooms" icon="property/bedrooms" aria-hidden="true" />
          <span class="body-sm">{{ listing.bedrooms }}</span>
        </div>
        <div v-if="hasBathrooms" class="listing-card__feature | body-sm font-semibold"
          :aria-label="`${listing.bathrooms} bathrooms`" :title="`${listing.bathrooms} bathrooms`">
          <AtomsIcon name="bathrooms" icon="property/bathrooms" aria-hidden="true" />
          <span class="body-sm">{{ listing.bathrooms }}</span>
        </div>
        <div v-if="hasReceptions" class="listing-card__feature | body-sm font-semibold"
          :aria-label="`${listing.receptions} receptions`" :title="`${listing.receptions} receptions`">
          <AtomsIcon name="receptions" icon="property/receptions" aria-hidden="true" />
          <span class="body-sm">{{ listing.receptions }}</span>
        </div>
      </div>

      <!-- View button -->
      <div class="listing-card__footer">
        <nuxt-link :to="`/listing/${listing.id}`" target="_blank"
          class="listing-card__view-btn | button button-secondary body-sm" aria-label="View property details"
          title="View property details">
          View
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Address {
  street?: string;
  city?: string;
  postcode?: string;
}

interface Props {
  listing: SummaryCardData;
  address?: Address;
}

const props = defineProps<Props>();

// Computed properties
const formattedPrice = computed(() => {
  return `£${parseInt(String(props.listing.price)).toLocaleString()}`;
});

const formattedPriceType = computed(() => {
  if (!props.listing.priceType) return "";
  // Capitalize the first letter of priceType and replace underscores with spaces
  return convertEnumToString(props.listing.priceType).toLowerCase();
});

const hasBedrooms = computed(
  () => props.listing.bedrooms !== null && props.listing.bedrooms !== undefined
);
const hasBathrooms = computed(
  () => props.listing.bathrooms !== null && props.listing.bathrooms !== undefined
);
const hasReceptions = computed(
  () => props.listing.receptions !== null && props.listing.receptions !== undefined
);

const typeText = computed(() =>
  [props.listing.propertyType, props.listing.classification]
    .filter(Boolean)
    .join(" - ")
);

const hasImage = computed(
  () => props.listing.image && props.listing.image[0] && props.listing.image[0].image
);

const isFeatured = computed(() => props.listing.tier === "FEATURED");
const isPremium = computed(() => props.listing.tier === "PREMIUM");
const isFeaturedOrPremium = computed(() => isFeatured.value || isPremium.value);
</script>

<style lang="scss">
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
  border-radius: calc(var(--border-radius-2xl) - 4px) 0 var(--border-radius-lg) 0;
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
  border-radius: calc(var(--border-radius-2xl) - var(--size-2)) calc(var(--border-radius-2xl) - var(--size-2)) 0 0;
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
  margin: var(--size-4) 0;
  color: var(--monochrome-600);
  text-transform: capitalize;
}

.listing-card__address {
  margin: var(--size-2) 0;
  color: var(--monochrome-600);
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
  margin: var(--size-4) 0;

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

/* ============================================
   OVERRIDE ACTION BUTTONS FOR SUMMARY CARD
   ============================================ */
.m-listing-card-image-actions {
  background-color: var(--secondary-400);
  border-radius: var(--border-radius-2xl);
  display: flex;
  gap: var(--size-2);
  padding: var(--size-4) var(--size-8);
}

.listing-card--premium .m-listing-card-image-actions {
  background-color: var(--primary-400);
}

.m-listing-card-image-actions .a-favourite-button,
.m-listing-card-image-actions .note-button {
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
  transition: border-color 0.2s;
}

.m-listing-card-image-actions .a-favourite-button svg,
.m-listing-card-image-actions .note-button svg {
  stroke: var(--monochrome-100);
}

.m-listing-card-image-actions .a-favourite-button:hover,
.m-listing-card-image-actions .note-button:hover {
  border-color: var(--secondary-400);
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