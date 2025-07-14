<template>
  <MoleculesListingCardBase :listing="listing">

    <template #premium-header>
      <div class="premium-content-header">
        <div class="premium-header-line"></div>
        <span class="premium-header-title">Premium</span>
        <div class="premium-header-line"></div>
      </div>
    </template>

    <template #image>
      <MoleculesListingCardNewImage :images="images" :listing-id="listing.id">
        <template #side-images>
          <div class="premium-side-images">
            <img v-if="images[1]" :src="images[1]" class="premium-side-image" alt="Property image 2" />
            <img v-if="images[2]" :src="images[2]" class="premium-side-image" alt="Property image 3" />
          </div>
        </template>
      </MoleculesListingCardNewImage>
    </template>

    <template #actions>
      <!-- View button only under main content -->
      <div class="premium-single-action">
        <MoleculesListingCardNewView :listing-id="listing.id" />
      </div>
    </template>

    <template #premium-content>
      <div class="premium-additional-content">
        <div class="premium-features-list">
          <div class="premium-feature-check">
            <i class="premium-check-icon">✓</i>
            <span>En-suite</span>
          </div>
          <div class="premium-feature-check">
            <i class="premium-check-icon">✓</i>
            <span>Garage</span>
          </div>
          <div class="premium-feature-check">
            <i class="premium-check-icon">✓</i>
            <span>Pet Friendly</span>
          </div>
          <div class="premium-feature-check">
            <i class="premium-check-icon">✓</i>
            <span>EV-Charging</span>
          </div>
          <div class="premium-feature-check">
            <i class="premium-check-icon">✓</i>
            <span>Garage</span>
          </div>
          <div class="premium-feature-check">
            <i class="premium-check-icon">✓</i>
            <span>Garage</span>
          </div>
        </div>
        <!-- Enquire button using individual component -->
        <div class="premium-single-action">
          <MoleculesListingCardNewEnquire :listing-id="listing.id" :user-id="listing.user.id" />
        </div>
      </div>
    </template>
  </MoleculesListingCardBase>
</template>

<script setup lang="ts">
interface Props {
  listing: ListingCardData;
}

const props = defineProps<Props>()

// Images for carousel and side thumbnails
const images = computed(() => {
  return props.listing.property?.media?.map((m: any) => m.image) ?? []
})
</script>

<style lang="scss">
// Premium card styling using data attribute selector
.m-listing-card[data-tier='PREMIUM'] {
  // Full width premium
  grid-column: span 2;
  width: 100%;
  max-width: none;

  // Premium styling
  border: 3px solid var(--primary-400);

  // Adjust image container to accommodate side images
  .m-listing-card-image-container {
    display: flex;

    // Override the base image width for premium layout (smaller to accommodate equal content widths)
    --image-width: 45%;
  }

  // Override content wrapper to be a proper grid
  .m-listing-card-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: var(--size-16);

    // Header spans full width
    .premium-content-header {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    // Content takes left column
    .m-listing-card-content {
      grid-column: 1;
      grid-row: 2;
    }

    // Additional content takes right column
    .premium-additional-content {
      grid-column: 2;
      grid-row: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

    }
  }

  @media (max-width: 768px) {
    grid-column: span 1;

    .m-listing-card-image-container {
      --image-width: 100%;
    }
  }
}

// Premium banner
.premium-banner {
  display: flex;
  align-items: center;
  gap: var(--size-16);
  padding: var(--size-16) var(--size-24) 0 var(--size-24);
}

.premium-label {
  color: var(--primary-400);
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.premium-divider {
  flex: 1;
  height: 2px;
  background: var(--primary-400);
  border-radius: 1px;
}

// Premium content header
.premium-content-header {
  display: flex;
  align-items: center;
  gap: var(--size-16);
  padding: var(--size-16) var(--size-24);
  background: var(--background-200);
}

.premium-header-line {
  flex: 1;
  height: 1px;
  background: var(--foreground-100);
}

.premium-header-title {
  color: var(--text-color);
  font-size: var(--font-size-xl);
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

// Side images
.premium-side-images {
  display: flex;
  flex-direction: column;
  gap: var(--size-4);
  padding: var(--size-8);
  width: 20%;
}

.premium-side-image {
  width: 100%;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}

// Premium additional content wrapper
.premium-additional-content {
  background: var(--background-200);
  padding: var(--size-16) var(--size-24);
}

// Premium features list
.premium-features-list {
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
}

.premium-feature-check {
  display: flex;
  align-items: center;
  gap: var(--size-8);
  color: var(--text-color);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.premium-check-icon {
  background: var(--primary-400);
  color: var(--monochrome-900);
  border-radius: 50%;
  width: var(--size-20);
  height: var(--size-20);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 700;
}

// Single action button styling
.premium-single-action {
  width: 100%;
  margin-top: var(--size-16);

  .button {
    width: 100%;
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    border-color: var(--secondary-400);
  }
}

@media (max-width: 1024px) {
  .premium-side-images {
    display: none;
  }
}
</style>
