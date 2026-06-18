<template>
  <section
    ref="root"
    class="property-card-root"
    :class="{ 'property-card-root--hidden': isListingHidden }"
  >
    <Transition name="fade">
      <div
        v-if="isListingHidden"
        class="property-card-root__hidden-overlay"
      >
        <UIcon
          name="i-lucide-eye-off"
          class="property-card-root__hidden-icon"
          aria-hidden
        />
        <span class="body-md">Hidden</span>
        <button
          type="button"
          class="property-card-root__hidden-undo | button-none body-sm"
          @click="unhideListing(listingId!)"
        >
          Undo
        </button>
      </div>
    </Transition>

    <div class="property-card-root__images | v-skeleton">
      <template v-if="imageCarouselArray">
        <PropertyCardCarousel
          :slides="imageCarouselArray"
          v-slot="{ slide }"
        >
          <PropertyCardMaybeLink :href="viewLinkUrl">
            <PropertyCardImage
              :provider="imageProvider"
              :src="slide"
              :alt="propertyImageAlt"
              variant="card"
              class="property-card-root__image"
              width="491"
              height="368"
              loading="lazy"
            />
          </PropertyCardMaybeLink>
        </PropertyCardCarousel>
      </template>

      <PropertyCardMaybeLink
        v-else-if="propertyImage"
        :href="viewLinkUrl"
      >
        <PropertyCardImage
          :provider="imageProvider"
          :src="propertyImage"
          :alt="propertyImageAlt"
          variant="card"
          class="property-card-root__image"
          width="491"
          height="368"
          loading="lazy"
        />
      </PropertyCardMaybeLink>

      <ClientOnly>
        <UBadge
          v-if="viewingLabel"
          :label="viewingLabel"
          icon="i-lucide-calendar"
          size="lg"
          color="secondary"
          variant="solid"
          class="absolute top-2 right-2 z-1 text-xs"
        />
      </ClientOnly>

      <PropertyCardHistory
        v-if="hasPriceHistory"
        class="property-card-root__image-overlay"
        :historic="priceHistory"
        :current="currentPriceNumber"
        :card-width="cardWidth"
      />
    </div>

    <div
      class="property-card-root__content | flow flow-sm"
      role="presentation"
    >
      <h2 class="property-card-root__price">
        <PropertyCardPill
          v-if="priceLabel"
          :content="priceLabel"
          variant="orange"
        />
        <PropertyCardPill
          v-if="rentFrequency"
          :content="rentFrequency"
          variant="orange"
        />

        <span class="property-card-root__price-amount | title-md">
          <PropertyCardMaybeLink :href="viewLinkUrl">
            {{ price }}
          </PropertyCardMaybeLink>
        </span>
      </h2>

      <p class="property-card-root__overview">
        <PropertyCardMaybeLink :href="viewLinkUrl">
          <strong class="property-card-root__overview-address">
            {{ overview }}
          </strong>
          {{ overviewAddress }}
        </PropertyCardMaybeLink>
      </p>

      <MoleculesScrollBox
        v-if="labels?.length"
        :scroll-indicator="true"
        class="property-card-root__labels-scrollbox"
      >
        <ul class="property-card-root__labels">
          <li
            v-for="label of labels"
            :key="label"
          >
            <PropertyCardPill :content="label" />
          </li>
        </ul>
      </MoleculesScrollBox>

      <MoleculesScrollBox
        v-if="icons?.length"
        :scroll-indicator="true"
        class="property-card-root__icons-scrollbox"
      >
        <ul class="property-card-root__icons">
          <li
            v-for="{ icon, count, label } of validIcons"
            :key="label"
            class="property-card-root__icon"
          >
            <span class="property-card-root__icon-count">
              <AtomsIcon
                :icon
                aria-hidden
              />
              {{ count }}
            </span>

            {{ label }}
          </li>
        </ul>
      </MoleculesScrollBox>

      <div
        class="property-card-root__buttons"
        aria-role="presentation"
      >
        <PropertyCardMaybeLink
          :href="viewLinkUrl"
          as="span"
          class="property-card-root__button property-card-root__button--view | body-sm"
          @click="!disabledInteractions && listingId && trackClick(listingId)"
        >
          View
        </PropertyCardMaybeLink>

        <AtomsEnquireButton
          v-if="listingId && userId"
          :disabled="disabledInteractions"
          :listing-id
          :user-id="userId"
          class="property-card-root__button property-card-root__button--enquire | body-sm"
        />
      </div>

      <div
        v-if="!disabledInteractions"
        class="property-card-root__footer"
        aria-role="presentation"
      >
        <PropertyCardSeller
          :name="sellerName"
          :profile-image="sellerImage"
        />

        <div
          role="presentation"
          class="property-card-root__footer-text"
        >
          <span
            role="presentation"
            class="property-card-root__footer-name | body-xs"
          >
            {{ profileText }}
          </span>
          <time
            :datetime="dateChanged"
            class="property-card-root__footer-date | body-2xs"
          >
            {{ timeAgo }}
          </time>
        </div>

        <PropertyCardInteractions
          v-if="listingId"
          :listing-id
          class="property-card-root__interactions"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useResizeObserver } from "@vueuse/core";

  interface FacilitiesIcon {
    icon: string;
    label: string;
    count?: number;
  }

  interface Props {
    saleOrRent?: "buy" | "rent" | string;
    propertyImage?: string;
    carouselImages?: string[];
    propertyImageAlt?: string;
    disabledInteractions?: boolean;
    imageProvider?: "cloudflare" | "local";
    price?: string;
    priceLabel?: string;
    rentFrequency?: string;
    priceHistory?: PriceHistoryEntry[];
    currentPriceNumber?: number;
    overview?: string;
    overviewAddress?: string;
    dateChanged?: string;
    dateChangedType?: "Added" | "Updated" | string;
    labels?: string[];
    icons?: FacilitiesIcon[];
    sellerImage?: string;
    sellerName?: string;
    viewUrl?: string;
    listingId?: number;
    userId?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    imageProvider: "cloudflare",
  });

  const { isHidden, unhideListing } = useHiddenListings();
  const { trackClick } = useAnalyticsTracking();
  const { loggedIn } = useUserSession();
  const { viewings, getActiveViewingForListing, getViewingStatusLabel, fetchViewings } =
    useViewings();

  onMounted(() => {
    if (loggedIn.value && props.listingId && viewings.value.length === 0) {
      fetchViewings().catch(() => {});
    }
  });

  const viewingLabel = computed(() => {
    if (!props.listingId) return null;
    const v = getActiveViewingForListing(props.listingId);
    return v ? getViewingStatusLabel(v) : null;
  });

  const isListingHidden = computed(
    () => !props.disabledInteractions && !!props.listingId && isHidden(props.listingId),
  );

  /**
   *  Get property card size
   */
  const cardWidth = shallowRef(200);
  const cardRoot = useTemplateRef("root");

  useResizeObserver(cardRoot, ([elem]) => {
    const { width } = asObject(elem?.contentRect);

    cardWidth.value = Math.floor(Number(width));
  });

  /**
   *  Price history
   */
  const hasPriceHistory = computed(() => asArray(props.priceHistory).length);

  /**
   *  Only include link URL if interactions are not disabled
   */
  const viewLinkUrl = computed(() => {
    const { viewUrl, disabledInteractions } = props;

    if (disabledInteractions) {
      return undefined;
    }

    return viewUrl;
  });

  /**
   *  Format profile text
   */
  const profileText = computed(() => {
    const { sellerName = "Virify" } = props;

    return `${sellerName}`;
  });

  /**
   *  Ensure icons are valid
   */
  const validIcons = computed(() => {
    const { icons } = props;

    return asArray(icons).filter((icon: FacilitiesIcon) => {
      return isObject(icon) && isString(icon.label) && isString(icon.icon);
    });
  });

  /**
   *  Get date as 'time ago'
   */
  const timeAgo = computed(() => {
    const { dateChanged, dateChangedType } = props;

    return [dateChangedType, getTimeAgo(dateChanged)].filter(Boolean).join(" ");
  });

  /**
   *  Get populated images for image carousel
   */
  const imageCarouselArray = computed(() => {
    const { carouselImages } = asObject(props);

    // If carousel images is not a populated array, return nothing
    if (!isPopulatedArray(carouselImages)) {
      return null;
    }

    // Get only array entries that are strings
    const imageStrings = carouselImages?.filter(isString) as string[];

    // Return array only if it has entries
    return imageStrings.length ? imageStrings : null;
  });
</script>

<style lang="scss">
  @use "#styles/_utils/functions" as fn;

  @mixin small-card {
    @container card (width < 275px) {
      @content;
    }
  }

  .property-card-root {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    container-name: card;
    container-type: inline-size;

    &__hidden-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--size-6);
      background-color: var(--background-200);
      border-radius: var(--border-radius-2xl);
      border: 1px solid var(--background-300);
    }

    &__hidden-icon {
      width: var(--size-32);
      height: var(--size-32);
      color: var(--monochrome-500);
    }

    &__hidden-undo {
      font-size: var(--font-xs);
      font-weight: var(--font-semibold);
      color: var(--primary-500);
      cursor: pointer;
      text-decoration: underline;

      &:hover {
        color: var(--primary-400);
      }
    }

    &--hidden {
      .property-card-root__images,
      .property-card-root__content {
        opacity: 0.35;
        pointer-events: none;
      }
    }

    &__images,
    &__image {
      width: 100%;
      aspect-ratio: 4/3;

      a {
        display: block;
      }
    }

    &__images {
      position: relative;
      border-radius: var(--border-radius-2xl);
      overflow: hidden;
    }

    &__image {
      display: block;
      object-fit: cover;
    }

    &__image-overlay {
      position: absolute;
      top: 0;
      left: 0;
    }

    &__content {
      display: flex;
      flex-direction: column;
      padding: var(--size-18);
      flex-grow: 1;

      @include small-card {
        padding: var(--size-12) 0;
      }
    }

    &__price {
      display: flex;
      flex-direction: column;
      gap: var(--size-2);
      margin: 0 0 var(--size-4);
    }

    &__price-amount {
      margin: var(--size-4) 0;
      line-height: 1;

      @include small-card {
        font-size: var(--title-sm);
      }
    }

    &__overview {
      font-size: var(--font-xs);
      line-height: var(--lineheight-sm);
      font-weight: var(--font-semisemibold);
      margin-bottom: auto;
      padding-right: var(--size-16);

      a,
      a:hover {
        text-decoration: none;
      }
    }

    &__overview-address {
      display: block;
      font-weight: var(--font-bold);
      font-size: var(--font-sm);
      line-height: var(--lineheight-sm);

      @include small-card {
        font-size: var(--font-xs);
      }
    }

    &__labels,
    &__icons {
      display: flex;
      justify-content: flex-start;
      list-style: none;
      margin: 0;
      padding: 0;

      @include small-card {
        padding-right: var(--size-10);
      }
    }

    &__labels-scrollbox,
    &__icons-scrollbox {
      @include small-card {
        margin-right: var(--size-16);
      }
    }

    &__labels {
      gap: var(--size-6);
      align-items: center;
    }

    &__icons {
      gap: var(--size-20);
      padding: var(--size-4) 0;
      align-items: flex-start;
      width: fit-content;

      @include small-card {
        gap: var(--size-16);
      }
    }

    &__icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-weight: var(--font-semibold);
      font-size: var(--font-2xs);
      line-height: var(--lineheight-sm);
      gap: var(--size-4);
      flex: 1 0 fit-content;
      max-width: 10ch;
      text-align: center;

      @include small-card {
        font-size: var(--font-3xs);
        gap: var(--size-2);
      }
    }

    &__icon-count {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--size-4);
      line-height: var(--size-24);
      font-size: var(--font-sm);
      line-height: var(--lineheight-sm);

      @include small-card {
        font-size: var(--font-xs);
      }

      .a-icon {
        width: var(--size-24);
        height: var(--size-24);
      }
    }

    &__buttons {
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      gap: var(--size-8);
      margin: var(--size-16) 0 0;

      @include small-card {
        margin: var(--size-12) 0 0;
      }
    }

    &__button {
      border: 0;
      padding: var(--size-8) var(--size-16);
      border-radius: var(--border-radius-lg);
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      font-weight: var(--font-bold);
      transition: background-color var(--animation-fast);
      color: var(--blue-500);
      background-color: light-dark(var(--blue-800), var(--blue-400));

      &--view[href] {
        color: currentColor;
        background-color: var(--primary-background-100);

        &:hover {
          color: currentColor;
          background-color: var(--primary-background-200);
        }
      }

      &--enquire:not([disabled]) {
        cursor: pointer;
        background: var(--primary-500);
        color: var(--monochrome-900);

        &:hover {
          background: var(--primary-400);
          color: var(--monochrome-900);
        }
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: var(--size-10);
      margin-top: var(--size-8);
      padding: var(--size-8);
      background-color: light-dark(var(--blue-800), var(--blue-300));
      border: 1px solid light-dark(var(--blue-600), var(--blue-400));
      border-radius: var(--border-radius-lg);
      font-weight: var(--font-semisemibold);

      @include small-card {
        display: grid;
        grid-template-columns: auto 1fr;
      }
    }

    &__footer-text {
      overflow: hidden;

      @include small-card {
        order: -1;
        grid-column: span 2;
        padding-bottom: var(--size-6);
        border-bottom: 1px solid light-dark(var(--blue-600), var(--blue-400));
      }
    }

    &__footer-name,
    &__footer-date {
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__footer-name {
      font-weight: var(--font-semibold);
    }

    &__footer-date {
      color: var(--blue-500);
    }

    &__interactions {
      margin-left: auto;
    }
  }
</style>
