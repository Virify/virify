<template>
  <div class="summary-card" :class="{
    'summary-card--featured': isFeatured,
    'summary-card--premium': isPremium,
  }">
    <!-- Banner -->
    <div v-if="isFeaturedOrPremium" class="summary-card__banner | body-sm font-bold">
      {{ isPremium ? "Premium" : "Featured" }}
    </div>
    <!-- Image -->
    <div class="summary-card__image-container">
      <nuxt-img provider="cloudflare" v-if="hasImage" :src="listing.image?.[0]?.image + '/card'"
      alt="Listing image" class="summary-card__image" />
    </div>
    <!-- Content -->
    <div class="summary-card__content">
      <!-- Price and Actions -->
      <div class="summary-card__header">
        <div class="summary-card__price | title-md">
          <p class="summary-card__price-value">{{ formattedPrice }}</p>
          <p class="summary-card__price-type | body-xs">
            {{ formattedPriceType }}
          </p>
        </div>
        <div class="summary-card__actions" @click.stop>
          <AtomsFavouriteButton :listing-id="Number(listing.id)" class="a-favourite-button" />
          <AtomsNoteButton :listing-id="Number(listing.id)" class="note-button" />
        </div>
      </div>

      <!-- Address -->
      <div v-if="address" class="summary-card__address | body-xs font-semibold">
        <span v-if="address.street">{{ address.street }},&nbsp;</span>
        <span v-if="address.city">{{ address.city }},&nbsp;</span>
        <span v-if="address.postcode">{{ address.postcode }}</span>
      </div>

      <!-- Property type -->
      <div v-if="typeText" class="summary-card__type | body-xs">
        {{ typeText }}
      </div>

      <!-- Features -->
      <div v-if="hasBedrooms || hasBathrooms" class="summary-card__features">
        <div v-if="hasBedrooms" class="summary-card__feature | font-semibold"
          :aria-label="`${listing.bedrooms} bedrooms`" :title="`${listing.bedrooms} bedrooms`">
          <AtomsIcon name="bedrooms" icon="property/bedrooms" aria-hidden="true" />
          <span class="body-sm">{{ listing.bedrooms }}</span>
        </div>
        <div v-if="hasBathrooms" class="summary-card__feature | body-sm font-semibold"
          :aria-label="`${listing.bathrooms} bathrooms`" :title="`${listing.bathrooms} bathrooms`">
          <AtomsIcon name="bathrooms" icon="property/bathrooms" aria-hidden="true" />
          <span class="body-sm">{{ listing.bathrooms }}</span>
        </div>
        <div v-if="hasReceptions" class="summary-card__feature | body-sm font-semibold"
          :aria-label="`${listing.receptions} receptions`" :title="`${listing.receptions} receptions`">
          <AtomsIcon name="receptions" icon="property/receptions" aria-hidden="true" />
          <span class="body-sm">{{ listing.receptions }}</span>
        </div>
      </div>

      <!-- View button -->
      <div class="summary-card__footer">
        <NuxtLink :to="`/listing/${listing.id}`"
          class="summary-card__view-btn | button body-sm" aria-label="View property details"
          :class="{
            'button-primary': isPremium,
            'button-secondary': isFeatured,
            'button-tertiary': isBasic
          }"
          title="View property details">
          View
        </NuxtLink>
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
const isBasic = computed(() => props.listing.tier === "BASIC");
const isFeatured = computed(() => props.listing.tier === "FEATURED");
const isPremium = computed(() => props.listing.tier === "PREMIUM");
const isFeaturedOrPremium = computed(() => isFeatured.value || isPremium.value);


</script>

<style lang="scss">
.summary-card {
  background-color: var(--background-200);
  border: none;
  border-radius: var(--border-radius-2xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  margin: 0;
  max-width: 280px;
  padding: 0;
  position: relative;
  width: 280px;

  // Tier variants
  &--featured {
    background-color: var(--background-200);
    border-color: var(--secondary-400);

    .summary-card__banner {
      left: -1px;
      top: -1px;
    }

    .summary-card__price {
      color: var(--secondary-400);
    }

    .summary-card__actions {
      background-color: var(--secondary-400);
    }

    .summary-card__view-btn {
      color: var(--monochrome-900);
    }
  }

  &--premium {
    background: var(--blue-400);
    color: var(--monochrome-900);

    .summary-card__banner {
      background-color: var(--primary-400);
      color: var(--monochrome-300);
      left: -1px;
      top: -1px;
    }

    .summary-card__price {
      color: var(--primary-400);
    }

    .summary-card__price-type {
      color: var(--text-color);
    }

    .summary-card__address {
      color: var(--text-color);
    }

    .summary-card__type { 
      color: var(--monochrome-900);
    }

    .summary-card__actions {
      background-color: var(--primary-400);
    }

    .summary-card__view-btn {
      color: var(--monochrome-100);
      background: var(--primary-400);

      &:hover {
        background-color: var(--primary-300);
      }
    }
    
  }

  // Banner
  &__banner {
    background-color: var(--secondary-400);
    border-radius: calc(var(--border-radius-2xl) - 4px) 0 var(--border-radius-lg) 0;
    color: var(--monochrome-900);
    left: -2px;
    padding: 6px 16px;
    position: absolute;
    top: 0;
    z-index: 3;
  }

  // Image
  &__image-container {
    border-radius: calc(var(--border-radius-2xl) - var(--size-2)) calc(var(--border-radius-2xl) - var(--size-2)) 0 0;
    height: 140px;
    overflow: hidden;
    position: relative;
    z-index: 1;
  }

  &__image {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  // Content
  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--size-4);
    padding: var(--size-12);
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
  }

  &__price {
    color: var(--blue-400);
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    // Dark mode override for better contrast
    @media (prefers-color-scheme: dark) {
      color: var(--monochrome-800);
    }
  }

  &__price-type {
    margin: var(--size-4) 0;
    color: var(--text-color);
    opacity: 0.7;
    text-transform: capitalize;
  }

  &__address {
    margin: var(--size-2) 0;
    color: var(--text-color);
    opacity: 0.8;
  }

  &__features {
    display: flex;
    gap: var(--size-8);
    margin: var(--size-4) 0;
  }

  &__feature {
    align-items: center;
    color: var(--text-color);
    font-size: var(--font-2xl);
    display: flex;
    gap: var(--size-4);
  }

  &__actions {
    background-color: var(--blue-400);
    border-radius: var(--border-radius-2xl);
    display: flex;
    gap: var(--size-2);
    padding: var(--size-4) var(--size-8);

    .a-favourite-button,
    .note-button {
      background: none;
      border: none;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: none;
      transition: border-color 0.2s;

      &:hover {
        border-color: var(--secondary-400);
      }
    }
  }

  &__footer {
    margin-top: auto;
  }

  &__view-btn {
    border-radius: var(--border-radius-lg);
    display: inline-block;
    padding: var(--size-8);
    text-align: center;
    text-decoration: none;
    width: 100%;
  }

  // Icon color fixes - PRESERVED EXACTLY AS WORKING
  .a-favourite-button svg,
  .note-button svg {
    color: var(--monochrome-900);
  }

  &--premium .a-favourite-button svg,
  &--premium .note-button svg {
    color: var(--monochrome-100);
  }
}
</style>