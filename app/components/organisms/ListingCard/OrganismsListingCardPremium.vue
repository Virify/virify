<template>
  <OrganismsListingCardBase :listing="listing">
    <!-- Premium Header Banner -->
    <template #premium-header>
      <div class="premium-content-header">
        <div class="premium-header-line"></div>
        <h1 class="premium-header-title | title-lg">Spotlight</h1>
        <div class="premium-header-line"></div>
      </div>
    </template>

    <!-- Premium Image Gallery with Side Thumbnails -->
    <template #image>
      <OrganismsListingCardNewImage :images="images" :listing-id="listing.id">
        <template
          #side-images="{ selectedIndex, goToSlide, images: allImages }"
        >
          <div class="premium-side-images">
             <AtomsCloudFlareImage
              v-for="(image, index) in getRotatedImages(allImages, selectedIndex)"
              :key="`${selectedIndex}-${index}`"
              :src="image.src"
              variant="thumbnail"
              class="premium-side-image"
              :class="{ active: image.isActive }"
              :alt="image.alt"
              @click="goToSlide(image.originalIndex)"
              :placeholder="true"
            />
          </div>
        </template>
      </OrganismsListingCardNewImage>
    </template>

    <!-- Price and Price Type -->
    <template #header>
      <AtomsListingCardNewHeader :price="listing.price" :price-type="priceType">
        <template #default="{ price, priceType }">
          <h2 class="premium-header | title-md">
            {{ price }}
            <span class="premium-price-type | body-sm">
              {{ priceType }}
            </span>
          </h2>
        </template>
      </AtomsListingCardNewHeader>
    </template>

    <!-- Property Title and Address -->
    <template #title>
      <AtomsListingCardNewTitle
        :address="listing.property.address"
        :type="listing.property.type.name"
        :classification="listing.property.classification.name"
      >
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
      </AtomsListingCardNewTitle>
    </template>

    <!-- Property Features (Bedrooms, Bathrooms, Receptions) -->
    <template #features>
      <AtomsListingCardNewFeatures
        :bedrooms="listing.property.numberBedrooms"
        :bathrooms="listing.property.numberBathrooms"
        :receptions="listing.property.numberReceptions"
      >
        <template #default="{ features }">
          <ul class="premium-features" aria-label="Property features">
            <li
              v-for="{ count, icon, iconTitle } of features"
              :key="iconTitle"
              class="premium-feature"
              :aria-label="`${count} ${iconTitle}`"
            >
              <AtomsIcon
                :name="iconTitle"
                :icon="icon"
                class="premium-feature-icon"
                :aria-hidden="true"
                :title="`${count} ${iconTitle}`"
              />
              <p
                class="premium-feature-count | body-sm"
                :title="`${count} ${iconTitle}`"
              >
                {{ count }}
              </p>
            </li>
          </ul>
        </template>
      </AtomsListingCardNewFeatures>
    </template>

    <!-- Property Tags (Chain Free, Listed Date, etc.) -->
    <template #tags>
      <AtomsListingCardNewTags
        :chain-free="listing.property.chainFree"
        :listed-date="listing.property.createdAt"
        :reduced="true"
      >
        <template #default="{ tags }">
          <ul class="premium-tags">
            <li v-for="tag in tags" :key="tag" class="premium-tag | body-xs">
              {{ tag }}
            </li>
          </ul>
        </template>
      </AtomsListingCardNewTags>
    </template>

    <!-- Property Description -->
    <template #description>
      <div class="premium-description | body-sm" v-if="listing.property?.description">
        <div
          class="premium-description-content"
          :class="{ collapsed: isDescriptionCollapsed }"
        >
          <p>{{ listing.property.description }}</p>
        </div>
        <button
          class="premium-description-toggle | body-xs"
          @click="toggleDescription"
          v-if="shouldShowToggle"
        >
          {{ isDescriptionCollapsed ? "Show more" : "Show less" }}
        </button>
      </div>
    </template>

    <!-- Agent Information -->
    <template #agent>
      <AtomsListingCardNewAgent
        :username="listing.user.username"
        :id="listing.user.id"
      >
        <template #default="{ username }">
          <NuxtLink to="#" class="premium-agent">
            <div class="premium-agent-logo">
              <AtomsIcon name="check" icon="tick-solid" />
            </div>
            <p class="premium-agent-text | body-xs font-semibold">
              {{ username }}
            </p>
          </NuxtLink>
        </template>
      </AtomsListingCardNewAgent>
    </template>

    <!-- Desktop Action Buttons -->
    <template #actions>
      <!-- View button only under main content -->
      <div class="premium-single-action">
        <OrganismsListingCardNewView :listing-id="listing.id">
          <span class="| button button-primary button-bordered button-full"
            >View</span
          >
        </OrganismsListingCardNewView>
      </div>
    </template>

    <!-- Premium Additional Content (Desktop Only) -->
    <template #premium-content>
      <div class="premium-additional-content">
        <div class="premium-features-wrapper">
          <div class="premium-features-list | body-sm">
            <div
              v-for="feature in premiumFeatures"
              :key="feature.label"
              class="premium-feature-check"
            >
              <span class="premium-check-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path
                    d="M13.485 2.929a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.443l6.071-6.07a1 1 0 0 1 1.414 0z"
                  />
                </svg>
              </span>
              <span>{{ feature.label }}</span>
            </div>
            <div
              v-if="premiumFeatures.length === 0"
              class="premium-feature-check"
            >
              <span>No premium features available</span>
            </div>
          </div>
        </div>
        <!-- Enquire button using individual component -->
        <div class="premium-single-action">
          <AtomsListingCardNewEnquire
            :listing-id="listing.id"
            :user-id="listing.user.id"
          >
            <template #default="{ disabled, enquiryLabel }">
              <button
                class="| button button-primary button-full body-sm"
                :disabled="disabled"
              >
                {{ enquiryLabel }}
              </button>
            </template>
          </AtomsListingCardNewEnquire>
        </div>
      </div>
    </template>

    <!-- Mobile Additional Features -->
    <template #mobile-content>
      <!-- Collapsible additional features for mobile -->
      <div class="premium-mobile-features">
        <div class="premium-features-list | body-sm">
          <div
            v-for="feature in premiumFeaturesMobile"
            :key="feature.label"
            class="premium-feature-check"
          >
            <span class="premium-check-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  d="M13.485 2.929a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414L6 9.443l6.071-6.07a1 1 0 0 1 1.414 0z"
                />
              </svg>
            </span>
            <span>{{ feature.label }}</span>
          </div>
          <div
            v-if="premiumFeaturesMobile.length === 0"
            class="premium-feature-check"
          >
            <span>No premium features available</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Mobile Action Buttons -->
    <template #mobile-actions>
      <!-- Contact button for mobile -->
      <div class="premium-mobile-actions">
        <OrganismsListingCardNewView :listing-id="listing.id">
          <span class="| button button-bordered button-full body-sm">View</span>
        </OrganismsListingCardNewView>
        <AtomsListingCardNewEnquire
          :listing-id="listing.id"
          :user-id="listing.user.id"
        >
          <template #default="{ disabled, enquiryLabel }">
            <button
              class="| button button-primary button-full body-sm"
              :disabled="disabled"
            >
              {{ enquiryLabel }}
            </button>
          </template>
        </AtomsListingCardNewEnquire>
      </div>
    </template>
  </OrganismsListingCardBase>
</template>

<script setup lang="ts">
import { getPremiumFeatures } from '~/utils/results/premium-features';

interface Props {
  listing: ListingCardData;
}

const props = defineProps<Props>();

const priceType = computed(() => {
  return (
    props.listing?.rentalListing?.rentFrequency ??
    props.listing?.saleListing?.priceType
  );
});

// Description collapsible functionality
const isDescriptionCollapsed = ref(true);
const shouldShowToggle = ref(false);

const toggleDescription = () => {
  isDescriptionCollapsed.value = !isDescriptionCollapsed.value;
};

// Check if toggle should be shown based on description length
onMounted(() => {
  if (props.listing.property?.description && props.listing.property.description.length > 100) {
    shouldShowToggle.value = true;
  }
});

/**
 *  Media
 */
const images = computed(() => {
  const media = props.listing?.property?.media;
  if (!Array.isArray(media)) return [];
  return media.filter((item) => item.image !== null);
});

// Function to get 4 rotating side images based on the selected index
const getRotatedImages = (allImages: any[], selectedIndex: number) => {
  const sideImages = [];
  const len = allImages.length;
  if (len === 0) return [];
  for (let i = 0; i < Math.min(4, len); i++) {
    const imageIndex = (selectedIndex + i) % len + 1;
    const img = allImages[imageIndex];
    if (!img) continue;
    sideImages.push({
      src: img.image,
      alt: img.metadata,
      originalIndex: imageIndex,
      isActive: imageIndex === selectedIndex,
      metadata: img.metadata,
    });
  }
  return sideImages;
};

const premiumFeatures = computed(() => getPremiumFeatures(props.listing, 16));
const premiumFeaturesMobile = computed(() => premiumFeatures.value.slice(0, 6));
</script>

<style lang="scss">
// Premium card styling using data attribute selector
.m-listing-card[data-tier="PREMIUM"] {
  // Full width premium
  grid-column: span 2;
  width: 100%;
  max-width: none;
  height: 100%;

  // Premium styling
  border: 5px solid var(--primary-400);
  background-color: var(--blue-400);
  color: var(--monochrome-900);

  // Image section
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
    border-top-left-radius: calc(
      var(--border-radius-2xl) + var(--size-2) - var(--size-8)
    );
    border-bottom-left-radius: calc(
      var(--border-radius-2xl) + var(--size-2) - var(--size-8)
    );
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    overflow: hidden;
  }

  .m-listing-card-image {
    border-top-left-radius: calc(
      var(--border-radius-2xl) + var(--size-2) - var(--size-8)
    );
    border-bottom-left-radius: calc(
      var(--border-radius-2xl) + var(--size-2) - var(--size-8)
    );
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  // Content layout
  .m-listing-card-content-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: var(--size-8);

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    // Header spans full width
    .premium-content-header {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    // Content takes left column
    .m-listing-card-content {
      grid-column: 1;
      grid-row: 2;
      padding: 0 0 var(--size-16) var(--size-16);

      @media (max-width: 768px) {
        padding: var(--size-16) var(--size-16) 0 var(--size-16);
      }
    }

    // Additional content takes right column
    .premium-additional-content {
      grid-column: 2;
      grid-row: 2;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      @media (max-width: 768px) {
        grid-column: 1;
        grid-row: auto;
        padding: 0 var(--size-16) var(--size-16);
      }
    }
  }

  // Sale tag positioning
  .m-listing-card-type-indicator {
    position: absolute;
    top: var(--size-16);
    right: var(--size-16);
    z-index: 10;
    background-color: var(--primary-400);
    color: inherit;
    opacity: 1;
    color: var(--monochrome-100);

    @media (max-width: 768px) {
      position: absolute;
      top: var(--size-20);
      left: var(--size-24);
      right: auto;
      z-index: 20;
      margin-left: 0;
      align-self: auto;
    }
  }

  // Image controls styling
  .m-listing-card-arrow-button {
    background-color: var(--primary-400);
    color: var(--monochrome-100);

    svg {
      color: var(--monochrome-100);
    }
  }

  .m-listing-card-image-counter {
    background-color: var(--primary-400);
    color: var(--monochrome-100);
  }

  .m-listing-card-image-actions {
    background-color: var(--primary-400);
  }

  .a-favourite-button:not(.selected),
  .note-button {
    color: var(--monochrome-100);
  }

&[data-tier="PREMIUM"] .m-listing-card-image-actions .a-favourite-button.selected {
    color: var(--favourite-colour);
  }

  &[data-tier="PREMIUM"] .m-listing-card-image-actions .a-favourite-button.selected svg {
    stroke: var(--monochrome-900);
  }

  .note-button-icon {
    color: var(--monochrome-100);
  }

  @media (max-width: 768px) {
    grid-column: span 1;
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
  background: var(--monochrome-900);
}

.premium-header-title {
  color: inherit;
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
  width: calc(100% - 72% - var(--size-8));
  border-radius: 0;
}

.premium-side-image {
  width: 100%;
  height: calc((100% - (var(--size-8) * 3)) / 4);
  object-fit: cover;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &.active {
    opacity: 1;
  }

  &:first-child {
    border-top-right-radius: var(--border-radius-2xl);
  }

  &:last-child {
    border-bottom-right-radius: var(--border-radius-2xl);
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
  color: inherit;
  &-header {
    align-items: baseline;
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    margin-bottom: 0;
  }

  &-price-type {
    color: var(--monochrome-600);
    text-transform: capitalize;
    font-weight: normal;
  }

  // Title section (property type and address)
  &-title {
    &-main {
      @extend %text-truncate;
    }

    &-location {
      @extend %text-truncate;
      color: var(--monochrome-600);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 95%;
      margin: 0;
    }
  }

  // Property features (bedrooms, bathrooms, etc.)
  &-features {
    display: flex;
    gap: var(--size-12);
    list-style: none;
    padding: 0;
  }

  &-feature {
    align-items: center;
    display: flex;
    font-weight: var(--font-semibold);
    gap: var(--size-4);

    &-icon {
      font-size: var(--font-3xl);
    }
  }

  // Tags section
  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    list-style: none;
    padding: 0;
  }

  &-tag {
    background-color: var(--primary-400);
    opacity: 1;
    padding: var(--size-8);
    border-radius: var(--border-radius-lg);
    color: var(--monochrome-100);
  }

  // Description section
  &-description {

    &-content {
      transition: max-height 0.3s ease-in-out;
      overflow: hidden;

      &.collapsed {
        max-height: 3em;

        @media (min-width: 769px) {
          max-height: none;
        }
      }

      &:not(.collapsed) {
        max-height: 20em;
      }
    }

    &-toggle {
      background: none;
      border: none;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      margin-top: var(--size-4);
      color: var(--primary-400);

      @media (min-width: 769px) {
        display: none;
      }
    }

    p {
      margin: 0;
      line-height: 1.5;
      color: inherit;
    }
  }

  // Agent section
  &-agent {
    align-items: center;
    display: flex;
    gap: var(--size-8);
    text-decoration: none;

    &-logo {
      align-items: center;
      background-color: var(--primary-400);
      border-radius: 50%;
      color: var(--monochrome-100);
      display: flex;
      font-size: var(--font-2xl);
      height: var(--size-32);
      justify-content: center;
      width: var(--size-32);
    }
  }

  // Additional content section
  &-additional-content {
    background: inherit;
    padding: 0 var(--size-16) var(--size-16) 0;
    color: inherit;

    @media (max-width: 768px) {
      display: none;
    }
  }

  // Features list in additional content
  &-features-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &-features-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--size-8);
    white-space: nowrap;
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

  &-mobile-features {
    display: none;
    background: var(--blue-400);
    color: var(--primary-400);

    @media (max-width: 768px) {
      display: block;
    }
  }

  // Single action button styling
  &-single-action {
    width: 100%;

    @media (max-width: 768px) {
      display: none;
    }

    .button {
      width: 100%;
      border-radius: var(--border-radius-lg);
      box-sizing: border-box;

      &.button-bordered {
        padding: var(--size-8);
        border-width: 2px;
        border-color: var(--primary-400);
      }

      &:not(.button-bordered) {
        padding: var(--size-10);
      }

      &:disabled {
        background: var(--primary-500);
        opacity: 0.7;
        color: var(--monochrome-400);

        &:hover {
          background: var(--primary-500);
          color: var(--monochrome-400);
          opacity: 0.7;
        }
      }
    }
  }

  &-mobile-actions {
    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--size-8);
      margin-top: var(--size-16);

      .button {
        border-radius: var(--border-radius-lg);
        box-sizing: border-box;
        padding: var(--size-10);

        &.button-bordered {
          padding: var(--size-8);
          border-width: 2px;
          border-color: var(--primary-400);
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .m-listing-card[data-tier="PREMIUM"] {
    .m-listing-card-image-wrapper {
      // Take full width on tablet
      width: 100%;
      box-sizing: border-box;
    }

    .m-listing-card-image-container {
      // Main image takes 50% of container
      width: 50%;
      aspect-ratio: 4/3;
      border-top-left-radius: calc(
        var(--border-radius-2xl) + var(--size-2) - var(--size-8)
      );
      border-bottom-left-radius: calc(
        var(--border-radius-2xl) + var(--size-2) - var(--size-8)
      );
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      overflow: hidden;
    }

    .premium-side-images {
      // Side images container takes 50% of container
      width: 50%;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: var(--size-8);
      height: 100%;

      :first-of-type img {
        border-radius: 0;
      }

      :nth-of-type(2) img {
        border-top-right-radius: calc(
          var(--border-radius-2xl) + var(--size-2) - var(--size-8)
        );
      }
    }

    .premium-side-image {
      // Each side image is square
      width: 100%;
      height: 100%;
      aspect-ratio: 1;
      object-fit: cover;

      &:first-child {
        border-top-right-radius: 0;
      }

      &:nth-child(2) {
        border-top-right-radius: var(--border-radius-2xl);
      }
    }
  }
}

@media (max-width: 768px) {
  .m-listing-card[data-tier="PREMIUM"] {
    .m-listing-card-image-wrapper {
      // Stack images vertically on mobile
      flex-direction: column;
      width: 100%;
    }

    .m-listing-card-image-container {
      // Main image takes full width on mobile
      width: 100%;
      aspect-ratio: 4/3;
      border-top-left-radius: calc(
        var(--border-radius-2xl) + var(--size-2) - var(--size-8)
      );
      border-top-right-radius: calc(
        var(--border-radius-2xl) + var(--size-2) - var(--size-8)
      );
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      overflow: hidden;
    }

    .m-listing-card-image {
      // Main image full width
      border-radius: calc(var(--border-radius-2xl) + var(--size-2) - var(--size-8))
        calc(var(--border-radius-2xl) + var(--size-2) - var(--size-8)) 0 0;
    }

    .premium-side-images {
      // Side images underneath, full width
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      gap: var(--size-8);
    }

    .premium-side-image {
      // Each side image in a row
      width: 100%;
      height: auto;
      aspect-ratio: 1;
      object-fit: cover;
      // Remove all right border radius in grid layout
      border-radius: 0;
      &:first-of-type img {
        border-bottom-left-radius: calc(
          var(--border-radius-2xl) + var(--size-2) - var(--size-8)
        );
      }
      &:nth-of-type(2) img {
        border-radius: 0;
      }
      &:last-of-type img {
        border-bottom-right-radius: calc(
          var(--border-radius-2xl) + var(--size-2) - var(--size-8)
        );
      }

      &:first-child {
       border-bottom-left-radius: var(--border-radius-2xl);
      }

      &:nth-child(2) {
        border-radius: 0;
      }

      &:last-child {
        border-bottom-right-radius: var(--border-radius-2xl);
      }
    }
  }
}
</style>
