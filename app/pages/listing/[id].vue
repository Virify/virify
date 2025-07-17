<template>
  <main>
    <div v-if="status === 'pending'">
      <h1>Loading...</h1>
    </div>

    <div v-else class="p-listing" role="presentation">
      <div
        ref="$mobile-carousel"
        class="p-listing__main-carousel p-listing__main-carousel--mobile"
        role="presentation"
      >
        <skeleton-loader
          class="p-listing__main-carousel-skeleton p-listing__main-carousel-skeleton--mobile"
        >
          <OrganismsListingCarousel
            v-if="!isDesktop"
            :slides="images"
            :width="1000"
            aspect-ratio="4/3"
          />
        </skeleton-loader>
      </div>

      <div class="p-listing__grid | container" role="presentation">
        <div class="p-listing__content | flow flow-sm">
          <div
            ref="$desktop-carousel"
            class="p-listing__main-carousel p-listing__main-carousel--desktop"
            role="presentation"
          >
            <skeleton-loader class="p-listing__main-carousel-skeleton">
              <OrganismsListingCarousel
                v-if="isDesktop"
                :slides="images"
                :width="1000"
              />
            </skeleton-loader>
          </div>

          <OrganismsListingOverview
            ref="$overview"
            class="p-listing__mobile-overview"
            :price="priceFormatted"
            :address="fullAddress"
          />

          <!-- General Property Information (Non-collapsible) -->
          <div v-if="property" class="p-listing__section">
            <OrganismsListingGeneralInfo
              :description="property?.description || undefined"
            />

            <div class="room-summary">
              <ul class="room-summary__items">
                <!-- item 1 -->

                <li
                  v-for="(item, index) in rooms"
                  :key="index"
                  class="room-summary-item"
                >
                  <div class="room-summary-item__title | title-md">
                    <p>{{ item.length || 1 }}</p>
                    <p>{{ item.type }}</p>
                  </div>
                  
                  <!-- Single room - show normally -->
                  <div
                    v-if="item.length <= 1"
                    class="room-summary-item__details"
                  >
                    <p
                      v-for="(detail, detailIndex) in item.data"
                      :key="detailIndex"
                      class="| body-md"
                    >
                      {{ detail }}
                    </p>
                  </div>
                  
                  <!-- Multiple rooms - show as carousel -->
                  <div v-else class="room-summary-item__details">
                    <MoleculesCarousel 
                      :ref="(el) => setCarouselRef(el, index)"
                      :slides="item.individualRooms"
                      class="room-carousel-container"
                    >
                      <template #default="{ slide }">
                        <p
                          v-for="(detail, detailIndex) in slide"
                          :key="detailIndex"
                          class="| body-md"
                        >
                          {{ detail }}
                        </p>
                      </template>
                    </MoleculesCarousel>
                    
                    <!-- Navigation arrows -->
                    <button 
                      class="room-carousel-arrow room-carousel-arrow--prev"
                      @click="scrollPrev(index)"
                    >
                      <AtomsChevron height="50" width="50" />
                    </button>
                    <button 
                      class="room-carousel-arrow room-carousel-arrow--next"
                      @click="scrollNext(index)"
                    >
                      <AtomsChevron height="50" width="50" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Location & Amenities (Non-collapsible) -->
          <div v-if="property" class="p-listing__section">
            <OrganismsListingSectionLocation
              :lat="property?.address?.lat!"
              :lon="property?.address?.lon!"
              :listing="listing"
              :amenities="amenitiesArray"
            />
          </div>
        </div>

        <div class="p-listing__sidebar" role="presentation">
          <Transition name="p-listing-images">
            <div class="p-listing__sidebar-expand" v-show="!isImagesVisible">
              <OrganismsListingCarousel
                class="p-listing__sidebar-carousel"
                :slides="images"
                :width="400"
              />
            </div>
          </Transition>

          <OrganismsListingSidebar
            :price="priceFormatted"
            :listing-id="listing?.id || 0"
            :address="fullAddress"
            :property-type="property?.type?.name"
            :property-size="property?.size || undefined"
            :price-number="listing?.price || undefined"
            :bedrooms="property?.numberBedrooms || undefined"
            :bathrooms="property?.numberBathrooms || undefined"
            :receptions="property?.numberReceptions || undefined"
            :ownership="property?.classification?.name"
            :year-built="property?.yearBuilt || undefined"
            :construction-type="property?.constructionType || undefined"
            :chain-free="property?.chainFree"
            :vacant="property?.vacant"
            :has-image-slide="!isImagesVisible"
          />
        </div>
      </div>
    </div>

    <client-only>
      <OrganismsListingMobileBanner
        v-if="!isDesktop"
        :price="priceFormatted"
        :overview-visible="isOverviewVisible"
      />
    </client-only>
  </main>
</template>

<script setup lang="ts">
import { useIntersectionObserver, useMediaQuery } from "@vueuse/core";
import breakpoints from "#styles/_utils/breakpoints.module.scss";
import MoleculesCarousel from "~/components/molecules/MoleculesCarousel.vue";
import AtomsChevron from "~/components/atoms/AtomsChevron.vue";

const route = useRoute();

/**
 *  Fetch listing
 */
const { data: listing, status } = await useAsyncData(
  "listing",
  () => {
    return $fetch<ListingWithFullProperty>(`/api/listing/${route.params?.id}`);
  },
  {
    deep: false,
  }
);

/**
 *  Content
 */
const property = computed(() => listing.value?.property);

const priceFormatted = computed(() => {
  const price = listing.value?.price;
  return isNumber(price) ? numberToCurrency(price) : "";
});

const extractFeatures = (features: any[]) => {
  const excludedKeys = ["id", "description", "createdAt", "updatedAt", "roomNumber", "size"];

  const allFeatures =
    features?.flatMap((feature) =>
      {
        const roomFeatures = Object.entries(feature)
          .filter(
            ([key, value]) =>
              (value === true || (typeof value === "string" && value)) &&
              !excludedKeys.includes(key)
          )
          .map(([key, value]) => {
            const formattedKey =
              key.charAt(0).toUpperCase() +
              key
                .slice(1)
                .replace(/([A-Z])/g, " $1")
                .trim();
            const featureText = typeof value === "string"
              ? value
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : formattedKey;
            
            // Add room number prefix only if there are multiple rooms
            return feature.roomNumber && features.length > 1
              ? `Room ${feature.roomNumber}: ${featureText}`
              : featureText;
          });

        // Add size information if available
        if (feature.size) {
          const roundedSize = Math.floor(feature.size);
          const sizeText = `Size: ${roundedSize}m²`;
          const formattedSize = feature.roomNumber && features.length > 1
            ? `Room ${feature.roomNumber}: ${sizeText}`
            : sizeText;
          roomFeatures.unshift(formattedSize); // Add size at the beginning
        }

        return roomFeatures;
      }
    ) || [];

  return [...new Set(allFeatures.flat())];
};

const rooms = computed(() => {

  const arr = [
    {
      length: property.value?.bedroomFeatures.length || 0,
      type: "bedrooms",
      data: extractFeatures(property.value?.bedroomFeatures || []),
      individualRooms: property.value?.bedroomFeatures?.map(feature => extractFeatures([feature])) || [],
    },
    {
      length: property.value?.bathroomFeatures.length || 0,
      type: "bathrooms",
      data: extractFeatures(property.value?.bathroomFeatures || []),
      individualRooms: property.value?.bathroomFeatures?.map(feature => extractFeatures([feature])) || [],
    },
    {
      length: property.value?.reception.length || 0,
      type: "receptions",
      data: extractFeatures(property.value?.reception || []),
      individualRooms: property.value?.reception?.map(feature => extractFeatures([feature])) || [],
    },
    {
      length: 1,
      type: "kitchen",
      data: extractFeatures([property.value?.kitchenFeatures].filter(Boolean)),
    },
    {
      length: 1,
      type: "living area",
      data: extractFeatures(
        [property.value?.livingAreaFeatures].filter(Boolean)
      ),
    },
    {
      length: 1,
      type: "dining room",
      data: extractFeatures(
        [property.value?.diningroomFeatures].filter(Boolean)
      ),
    },
    {
      length: 1,
      type: "utility",
      data: extractFeatures([property.value?.utility].filter(Boolean)),
    },
    {
      length: 1,
      type: "additional toilet",
      data: extractFeatures([property.value?.additionalToilet].filter(Boolean)),
    },
  ];
  return arr;
});

const fullAddress = computed(() => {
  return property.value?.address?.fullAddress || "No address provided";
});

// Room carousel controls
const carouselRefs = ref<{ [key: number]: any }>({})

function setCarouselRef(el: any, index: number) {
  if (el) {
    carouselRefs.value[index] = el
  }
}

function scrollPrev(index: number) {
  carouselRefs.value[index]?.scrollPrev()
}

function scrollNext(index: number) {
  carouselRefs.value[index]?.scrollNext()
}



// Handle amenities array/object conversion
const amenitiesArray = computed(() => {
  const amenities = property.value?.amenities;
  if (!amenities) return null;
  return Array.isArray(amenities) ? amenities : [amenities];
});

/**
 *  Media
 */
const images = computed(() => {
  const media = property.value?.media;
  if (!Array.isArray(media)) return [];

  return media
    .filter((item) => item.image !== null)
    .map((item) => ({
      image: item.image!,
      metadata: item.metadata,
    }));
});

/**
 *  Toggle media visibility
 */
const $mobileCarousel = useTemplateRef("$mobile-carousel");
const $desktopCarousel = useTemplateRef("$desktop-carousel");
const isDesktop = useMediaQuery(`(min-width: ${breakpoints.notebook})`);
const isImagesVisible = shallowRef(true);

function parallaxCarousel() {
  if (isDesktop.value) return;

  // Get elem to watch
  const elem = unref($mobileCarousel);

  // Ensure element exists
  if (!elem) return;

  // Get top scroll position
  const getScrollTop = window.scrollY;
  const getScrollThreshold = elem.offsetHeight;

  // Calculate as transform from the top, if below threshold
  if (getScrollTop < getScrollThreshold) {
    elem.style.transform = `translateY(${getScrollTop / 2}px)`;
  }
}

useIntersectionObserver($desktopCarousel, ([entry]) => {
  isImagesVisible.value = !!entry?.isIntersecting;
});

onMounted(() => {
  window.addEventListener("scroll", parallaxCarousel, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", parallaxCarousel);
});

/**
 *  Toggle overview scroll
 */
const $overview = useTemplateRef("$overview");
const isOverviewVisible = shallowRef(true);

useIntersectionObserver($overview, ([entry]) => {
  isOverviewVisible.value = !!entry?.isIntersecting;
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;
@use "#styles/_utils/functions" as fn;

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.p-listing {
  margin-top: var(--size-32);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: calc(var(--container-padding) / 2);
    align-items: flex-start;

    @include mq.not-notebook {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: none;
      background: var(--background-100);
      border-top-right-radius: var(--border-radius-3xl);
      border-top-left-radius: var(--border-radius-3xl);
      padding: var(--border-radius-3xl) 0 0;
      margin: calc(0px - var(--border-radius-3xl)) 0 0;
    }

    @include mq.notebook {
      grid-template-columns: 1fr 18em;
    }

    @include mq.desktop {
      grid-template-columns: 1fr 20em;
    }
  }

  /**
   *  Content wrappers
   */
  &__mobile-overview {
    @include mq.notebook {
      display: none;
    }
  }

  &__content {
    overflow: hidden;

    @include mq.not-notebook {
      padding-inline: var(--size-24);
    }
  }

  &__sidebar {
    display: none;

    @include mq.notebook {
      display: block;
      position: sticky;
      top: calc(var(--header-height) + var(--size-32));
      max-height: calc(100dvh - var(--header-height));
      overflow: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      padding-bottom: var(--size-16);
    }

    &-expand {
      overflow: hidden;
      display: none;

      @include mq.notebook {
        display: block;
      }
    }
  }

  .room-summary {
    padding: var(--size-16);
    &__items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: var(--size-24);
    }
    &-item {
      display: flex;
      flex-direction: column;
      border-radius: var(--border-radius-2xl);
      overflow: hidden;
      background: var(--blue-400);
      text-align: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
      }

      &__title {
        width: 100%;
        padding: var(--size-24) 0;
        background: url("/img/logo-background.svg") no-repeat center right, var(--secondary-400);
        background-size: auto 250%, cover;
        color: var(--foreground-100);
        text-transform: capitalize;
        margin: 0;
      }

      &__details {
        position: relative;
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        justify-content: center;;
        padding: var(--size-24) var(--size-16);
        color: var(--monochrome-900);
      }
    }
  }

  .room-carousel-container {
    position: relative;
  }



  .room-carousel-arrow {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    color: var(--secondary-400);

    &--prev {
      left: 8px;
      transform: translateY(-50%) rotate(90deg);
    }

    &--next {
      right: 8px;
      transform: translateY(-50%) rotate(-90deg);
    }
  }

  /**
   *  Images
   */
  &__main-carousel,
  &__sidebar-carousel {
    background: var(--foreground-300);
    overflow: hidden;
  }

  &__main-carousel {
    &--mobile {
      display: block;

      @include mq.notebook {
        display: none;
      }
    }

    &--desktop {
      display: none;

      @include mq.notebook {
        display: block;
        border-radius: var(--border-radius-3xl);
        margin-bottom: var(--size-24);
      }
    }
  }

  &__sidebar-carousel {
    border-radius: var(--border-radius-2xl);
    margin-bottom: var(--size-24);
  }

  /**
   *  Skeleton loaders
   */
  &__main-carousel-skeleton {
    aspect-ratio: 16 / 9;
    width: 100%;

    &--mobile {
      aspect-ratio: 4 / 3;
      max-height: 70vh;
    }
  }
}

/**
 *  Animations
 */
.p-listing-images-enter-active,
.p-listing-images-leave-active {
  interpolate-size: allow-keywords;

  height: calc-size(max-content, size);
  transition-property: opacity, height, transform, margin;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-in-out);
  transform-origin: 100% 100%;
}

.p-listing-images-leave-to,
.p-listing-images-enter-from {
  height: 0;
  margin: 0;
  transform: translateY(-100%);
}
</style>
