<template>
  <MoleculesListingCardBase :listing="listing">

    <template #premium-header>
      <div class="premium-content-header">
        <div class="premium-header-line"></div>
        <h1 class="premium-header-title | title-lg">Premium</h1>
        <div class="premium-header-line"></div>
      </div>
    </template>

    <template #image>
      <MoleculesListingCardNewImage :images="images" :listing-id="listing.id">
        <template #side-images="{ selectedIndex, goToSlide, images: allImages }">
          <div class="premium-side-images">
            <img v-for="(image, index) in getRotatedImages(allImages, selectedIndex)" :key="`${selectedIndex}-${index}`"
              :src="image.src" class="premium-side-image" :class="{ 'active': image.isActive }"
              :alt="`Property thumbnail ${index + 1}`" @click="goToSlide(image.originalIndex)" />
          </div>
        </template>
      </MoleculesListingCardNewImage>
    </template>

    <template #header>
      <MoleculesListingCardNewHeader :price="listing.price" :price-type="priceType">
        <template #default="{ price, priceType }">
          <h2 class="premium-header | title-md">
            {{ price }}
            <span class="premium-price-type | body-sm">
              {{ priceType }}
            </span>
          </h2>
        </template>
      </MoleculesListingCardNewHeader>
    </template>

    <template #title>
      <MoleculesListingCardNewTitle :address="listing.property.address" :type="listing.property.type.name"
        :classification="listing.property.classification.name">
        <template #default="{ address, type, classification }">
          <div class="premium-title">
            <h3 class="premium-title-main | body-md font-semibold">
              {{ classification }} {{ type }}
            </h3>
            <p class="premium-title-location | body-sm">
              {{ address.street }}, {{ address.city }}, {{ address.postcode }}
            </p>
          </div>
        </template>
      </MoleculesListingCardNewTitle>
    </template>

    <template #features>
      <MoleculesListingCardNewFeatures :bedrooms="listing.property.numberBedrooms"
        :bathrooms="listing.property.numberBathrooms" :receptions="listing.property.numberReceptions">
        <template #default="{ features }">
          <ul class="premium-features" aria-label="Property features">
            <li v-for="{ count, icon, iconTitle } of features" :key="iconTitle" class="premium-feature" 
                :aria-label="`${count} ${iconTitle}`">
              <AtomsIcon :name="iconTitle" :icon="icon" class="premium-feature-icon" :aria-hidden="true" :title="`${count} ${iconTitle}`" />
              <p class="premium-feature-count | body-sm" :title="`${count} ${iconTitle}`">{{ count }}</p>
            </li>
          </ul>
        </template>
      </MoleculesListingCardNewFeatures>
    </template>

    <template #tags>
      <MoleculesListingCardNewTags :chain-free="listing.property.chainFree" :listed-date="listing.property.createdAt"
        :reduced="true">
        <template #default="{ tags }">
          <ul class="premium-tags">
            <li v-for="tag in tags" :key="tag" class="premium-tag | body-xs">
              {{ tag }}
            </li>
          </ul>
        </template>
      </MoleculesListingCardNewTags>
    </template>

    <template #description>
      <div class="premium-description | body-sm" v-if="listing.description">
        <p>{{ listing.description }}</p>
      </div>
    </template>

    <template #agent>
      <MoleculesListingCardNewAgent :username="listing.user.username" :id="listing.user.id">
        <template #default="{ username, id }">
          <NuxtLink to="#" class="premium-agent">
            <div class="premium-agent-logo">
              <AtomsIcon name="check" icon="tick-solid" />
            </div>
            <p class="premium-agent-text | body-xs font-semibold">{{ username }}</p>
          </NuxtLink>
        </template>
      </MoleculesListingCardNewAgent>
    </template>

    <template #actions>
      <!-- View button only under main content -->
      <div class="premium-single-action">
        <MoleculesListingCardNewView :listing-id="listing.id">
          <span class="| button button-primary button-bordered button-full">View</span>
        </MoleculesListingCardNewView>
      </div>
    </template>

    <template #premium-content>
      <div class="premium-additional-content">
        <div class="premium-features-wrapper">
          <div class="premium-features-list | body-sm">
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
            <div class="premium-feature-check">
              <i class="premium-check-icon">✓</i>
              <span>Garden</span>
            </div>
            <div class="premium-feature-check">
              <i class="premium-check-icon">✓</i>
              <span>Balcony</span>
            </div>
            <div class="premium-feature-check">
              <i class="premium-check-icon">✓</i>
              <span>Parking</span>
            </div>
            <div class="premium-feature-check">
              <i class="premium-check-icon">✓</i>
              <span>Furnished</span>
            </div>
            <div class="premium-feature-check">
              <i class="premium-check-icon">✓</i>
              <span>Modern Kitchen</span>
            </div>
            <div class="premium-feature-check">
              <i class="premium-check-icon">✓</i>
              <span>High Ceilings</span>
            </div>
          </div>
        </div>
        <!-- Enquire button using individual component -->
        <div class="premium-single-action">
          <MoleculesListingCardNewEnquire :listing-id="listing.id" :user-id="listing.user.id">
            <template #default="{ disabled, enquiryLabel }">
              <button class="| button button-primary button-full body-sm" :disabled="disabled">{{ enquiryLabel
                }}</button>
            </template>
          </MoleculesListingCardNewEnquire>
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

const priceType = computed(() => {
  return props.listing?.rentalListing?.rentFrequency ?? props.listing?.saleListing?.priceType;
});

// Use all images for carousel
const images = computed(() => {
  const allImages = props.listing.property?.media?.map((m: any) => m.image) ?? []
  const mockImages = [
    'https://picsum.photos/400/300?random=1',
    'https://picsum.photos/400/300?random=2',
    'https://picsum.photos/400/300?random=3',
    'https://picsum.photos/400/300?random=4',
    'https://picsum.photos/400/300?random=5',
    'https://picsum.photos/400/300?random=6',
    'https://picsum.photos/400/300?random=7',
    'https://picsum.photos/400/300?random=8'
  ]

  // Always ensure we have at least 8 images for testing rotation
  if (allImages.length >= 8) {
    return allImages
  } else {
    // Supplement real images with mock images to reach 8 total
    return [...allImages, ...mockImages.slice(0, 8 - allImages.length)]
  }
})

// Function to get 4 rotating side images based on the selected index
const getRotatedImages = (allImages: string[], selectedIndex: number) => {
  const sideImages = []

  // Always show exactly 4 side images, cycling through all available images
  for (let i = 0; i < 4; i++) {
    const imageIndex = (selectedIndex + i) % allImages.length
    sideImages.push({
      src: allImages[imageIndex],
      originalIndex: imageIndex,
      isActive: imageIndex === selectedIndex
    })
  }

  return sideImages
}
</script>

<style lang="scss">
// Premium card styling using data attribute selector
.m-listing-card[data-tier='PREMIUM'] {
  // Full width premium
  grid-column: span 2;
  width: 100%;
  max-width: none;
  height: 100%;

  // Premium styling
  border: 5px solid var(--primary-400);
  background-color: var(--blue-400);
  color: var(--primary-400);

  // Adjust image container to accommodate side images
  .m-listing-card-image-wrapper {
    display: flex;
    width: 80%;
    aspect-ratio: 16/9;
    align-items: stretch;
    padding: var(--size-8);
  }

  .m-listing-card-image-container {
    flex: 1;
    aspect-ratio: unset;
    border-top-left-radius: calc(var(--border-radius-2xl) + var(--size-2) - var(--size-8));
    border-bottom-left-radius: calc(var(--border-radius-2xl) + var(--size-2) - var(--size-8));
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  // Override content wrapper to be a proper grid
  .m-listing-card-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: var(--size-8);

    // Header spans full width
    .premium-content-header {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    // Content takes left column
    .m-listing-card-content {
      grid-column: 1;
      grid-row: 2;
      padding: 0 0 var(--size-16) var(--size-16)
    }

    // Additional content takes right column
    .premium-additional-content {
      grid-column: 2;
      grid-row: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

    }
  }

  // Position sale tag absolutely in top right corner for premium cards
  .m-listing-card-type-indicator {
    position: absolute;
    top: var(--size-16);
    right: var(--size-16);
    z-index: 10;
    background-color: var(--primary-400);
    color: black;
    opacity: 1;
  }


  // Override arrow, counter, and action button colors for premium
  .m-listing-card-arrow-button {
    background-color: var(--primary-400);
    color: black;

    svg {
      color: black;
    }
  }

  .m-listing-card-image-counter {
    background-color: var(--primary-400);
    color: black;
  }

  .m-listing-card-image-actions {
    background-color: var(--primary-400);

    .a-favourite-button,
    .note-button {
      background-color: var(--primary-400);
      color: black;

      svg {
        color: black;
      }
    }
  }

  @media (max-width: 768px) {
    grid-column: span 1;

    .m-listing-card-image-container {
      --image-width: 100%;
    }
  }
}

// Premium content header
.premium-content-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--size-16);
  padding-top: var(--size-16);
  background: inherit;
}

.premium-header-line {
  width: 150px;
  height: 1px;
  background: var(--primary-400);
}

.premium-header-title {
  color: var(--primary-400);
  padding-bottom: 0;
  margin: 0;
  text-align: center;
  white-space: nowrap;
}

// Side images
.premium-side-images {
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
  padding: 0;
  height: 100%;
  // Calculate width: remaining space after main image and gap
  width: calc(100% - 72% - var(--size-8));
  transition: all 0.3s ease-in-out;
}

.premium-side-image {
  width: 100%;
  // Dynamic height: (container height - 3 gaps) / 4 images
  height: calc((100% - (var(--size-8) * 3)) / 4);
  object-fit: cover;
  cursor: pointer;
  border-radius: 0;
  transition: all 0.3s ease-in-out;

  &:first-child {
    border-top-right-radius: calc(var(--border-radius-2xl) + var(--size-2) - var(--size-8));
  }

  &:last-child {
    border-bottom-right-radius: calc(var(--border-radius-2xl) + var(--size-2) - var(--size-8));
  }

  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }

  &.active {
    opacity: 1;
  }
}

// Premium component styles
%text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.premium {
  // Header section (price and type)
  &-header {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    margin-bottom: 0;
    color: var(--primary-400);
  }

  &-price-type {
    color: var(--primary-300);
    text-transform: capitalize;
    font-weight: normal;
  }

  // Title section (property type and address)
  &-title {
    margin-bottom: var(--size-16);

    &-main {
      @extend %text-truncate;
      color: var(--primary-400);

    }

    &-location {
      @extend %text-truncate;
      color: var(--primary-300);
      margin-bottom: var(--size-8);
    }
  }

  // Property features (bedrooms, bathrooms, etc.)
  &-features {
    display: flex;
    gap: var(--size-12);
    list-style: none;
    margin-bottom: var(--size-16);
    padding: 0;
  }

  &-feature {
    align-items: center;
    display: flex;
    font-weight: var(--font-semibold);
    gap: var(--size-4);
    color: var(--primary-400);

    &-icon {
      font-size: var(--font-2xl);
      color: white;
    }

    &-count {
      color: white;
    }
  }

  // Tags section
  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    list-style: none;
    margin-bottom: var(--size-16);
    padding: 0;
  }

  &-tag {
    background-color: var(--blue-500);
    opacity: 1;
    color: var(--monochrome-900);
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
  }

  // Description section
  &-description {
    margin-bottom: var(--size-16);
    color: white;
    
    p {
      margin: 0;
      line-height: 1.5;
      color: white;
    }
  }

  // Agent section
  &-agent {
    align-items: center;
    display: flex;
    gap: var(--size-8);
    text-decoration: none;
    color: white;

    &-logo {
      align-items: center;
      background-color: var(--primary-400);
      border-radius: 50%;
      color: black;
      display: flex;
      font-size: var(--font-2xl);
      height: var(--size-32);
      justify-content: center;
      width: var(--size-32);
    }

    &-text {
      color: white;
    }
  }

  // Additional content section
  &-additional-content {
    background: inherit;
    padding: 0 var(--size-8) var(--size-16) 0;
    color: inherit;
  }

  // Features list in additional content
  &-features-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  &-features-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-8);
  }

  &-feature-check {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    color: var(--text-color);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  &-check-icon {
    color: var(--primary-400);
    width: var(--size-20);
    height: var(--size-20);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xs);
    font-weight: 700;
  }

  // Single action button styling
  &-single-action {
    width: 100%;
    margin-top: var(--size-16);

    .button {
      width: 100%;
      padding: var(--size-8);
      border-radius: var(--border-radius-lg);
      box-sizing: border-box;

      &.button-bordered {
        border-width: 2px;
        border-color: var(--primary-400);
      }

      &:disabled {
        background: var(--primary-400);
        opacity: 0.7;

        &:hover {
          background: var(--primary-400);
          opacity: 0.7;
        }
      }
    }
  }
}

@media (max-width: 1024px) {
  .premium-side-images {
    display: none;
  }
}
</style>
