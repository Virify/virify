<template>
  <Teleport to="body">
    <div v-show="!galleryVisible && !modalOpen" class="o-listing-mobile-banner" role="presentation" :class="{
      'o-listing-mobile-banner--expanded': isExpanded
    }">
      <div class="| container" role="presentation">
        <Transition name="o-listing-mobile-banner">
          <button ref="$handle" v-show="!overviewVisible" type="button" class="o-listing-mobile-banner__drag-handle"
            :aria-label="isExpanded ? 'Hide additional information' : 'Show additional information'"></button>
        </Transition>

        <Teleport to="body">
          <button v-show="isDragging || isExpanded" ref="$backdrop"
            class="o-listing-mobile-banner__additional-info-backdrop" @click.prevent="closeExpanded"
            aria-label="Close additional information"></button>
        </Teleport>

        <div v-show="isDragging || isExpanded" ref="$additional" class="o-listing-mobile-banner__additional-info"
          :class="{
            'o-listing-mobile-banner__additional-info--expanded': isExpanded
          }">

          <h2 v-if="price"
            class="o-listing-mobile-banner__title o-listing-mobile-banner__title--mobile-only | title-md lineheight-xs">
            {{ price }}
            <AtomsPriceHistoryPopover v-if="priceHistory?.length" :price-history="priceHistory!" :current-price="currentPriceNumber!" />

            <AtomsPill class="o-listing-mobile-banner__title-offertype | body-2xs">
              {{ convertEnumToString(priceType!) }}
            </AtomsPill>
            <AtomsPill class="o-listing-mobile-banner__title-offertype | body-2xs">
              {{ convertEnumToString(available!) }}
            </AtomsPill>
          </h2>

          <ClientOnly>
            <div v-if="viewingLabel" class="flex justify-center mt-4">
              <UBadge
                :label="viewingLabel"
                icon="i-lucide-calendar"
                size="md"
                color="secondary"
                variant="solid"
              />
            </div>
          </ClientOnly>

          <p role="presentation" class="o-listing-mobile-banner__additional-info-address | body-md">
            {{ address }}
          </p>

          <div role="presentation">
            <h3 class="o-listing-mobile-banner__additional-info-subtitle | title-sm">At a glance</h3>

            <OrganismsListingSidebarIcons class="o-listing-mobile-banner__additional-info-icons"
              :property-type="propertyType" :bedrooms="bedrooms" :bathrooms="bathrooms" :receptions="receptions"
              :other-rooms="otherRooms" :has-garden="hasGarden" :has-land="hasLand" :classification="classification" />

            <div class="o-listing-mobile-banner__additional-info-pills">
              <OrganismsListingSidebarPills :property-size="propertySize" :chain-free="chainFree"
                :year-built="yearBuilt" :construction-type="constructionType" />
            </div>
          </div>

          <OrganismsListingAgent :agent="agent" />
        </div>

        <div class="o-listing-mobile-banner__grid" role="presentation">
          <div class="o-listing-mobile-banner__overview" role="presentation">
            <h2 v-if="price" class="o-listing-mobile-banner__title | title-md lineheight-xs">
              {{ price }}
              <AtomsPriceHistoryPopover v-if="priceHistory?.length" :price-history="priceHistory!" :current-price="currentPriceNumber!" />

              <AtomsPill class="o-listing-mobile-banner__title-offertype | body-2xs">
                {{ convertEnumToString(priceType!) }}
              </AtomsPill>
            </h2>

            <p role="presentation" class="o-listing-mobile-banner__address | body-md">
              {{ address }}
            </p>
          </div>

          <OrganismsListingButtons class="o-listing-mobile-banner__buttons" :listing-id="listingId || 0" :agent="agent"
            :is-draft="isDraft" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 *  Props
 */
interface Props {
  price: string
  overviewVisible?: boolean
  galleryVisible?: boolean
  modalOpen?: boolean
  address?: string
  priceType?: string
  propertyType?: string
  propertySize?: number
  bedrooms?: number
  bathrooms?: number
  receptions?: number
  otherRooms?: number
  classification?: string
  yearBuilt?: string
  constructionType?: string
  chainFree?: boolean | null
  hasGarden?: boolean
  hasLand?: boolean
  listingId?: number
  agent?: {
    username?: string | null
    email?: string | null
    id?: number | null
    createdAt?: Date | String | null
    avatar?: string | null
  }
  available?: string
  isDraft?: boolean
  priceHistory?: PriceHistoryEntry[]
  currentPriceNumber?: number
}

const props = withDefaults(defineProps<Props>(), {
  overviewVisible: true,
  galleryVisible: false,
  modalOpen: false
})

/**
 *  Mobile banner additional information dragger
 */

// Elements
const $handle = useTemplateRef('$handle')
const $backdrop = useTemplateRef('$backdrop')
const $additional = useTemplateRef('$additional')

// Drag thresholds
const DRAG_OPEN_THRESHOLD = 80
const DRAG_CLOSE_THRESHOLD = 120

// Drag handle open state
const isExpanded = shallowRef(false)
const additionalInfoHeight = shallowRef(0)

// Drag events
const isDragging = shallowRef(false)
const backdropIsDragging = shallowRef(false)

// Auto-close when overview becomes visible again OR gallery becomes visible OR modal opens
watch(() => props.overviewVisible, (newValue, oldValue) => {
  if (newValue && !oldValue && isExpanded.value) {
    // Overview just became visible and banner is expanded - auto close
    closeExpanded()
  }
})

watch(() => props.galleryVisible, (isVisible) => {
  if (isVisible && isExpanded.value) {
    // Gallery is visible and banner is expanded - auto close
    closeExpanded()
  }
})

watch(() => props.modalOpen, (isOpen) => {
  if (isOpen && isExpanded.value) {
    // Modal opened and banner is expanded - auto close
    closeExpanded()
  }
})

// Set up dragging
useVerticalDrag($handle, {
  onDragMounted() {
    closeExpanded()
  },
  onDragStart() {
    isDragging.value = true
    if (isExpanded.value) {
      additionalInfoHeight.value = unref($additional)?.clientHeight || 0
    }
  },
  onDrag({ relativeY }) {
    if (isExpanded.value) {
      // Handle dragging down when expanded (to close) - exact mirror of drag up behavior
      const clampedValue = clampNumber(-relativeY, { min: 0, max: DRAG_CLOSE_THRESHOLD })
      const infoHeight = additionalInfoHeight.value
      const remainingHeight = infoHeight - clampedValue

      // Set styling during drag
      setStyle($additional, {
        height: remainingHeight + 'px',
        overflow: 'hidden'
      })

      // Auto-close when threshold reached - but let it animate smoothly
      if (-relativeY > DRAG_CLOSE_THRESHOLD) {
        isDragging.value = false

        // Set final closed state with smooth transition
        setStyle($additional, {
          height: '0px',
          overflow: 'hidden'
        })

        // Set expanded state after animation completes
        setTimeout(() => {
          isExpanded.value = false
        }, 200) // Match animation duration
      }
    } else {
      // Handle dragging up when collapsed (to open)
      const clampedValue = clampNumber(relativeY, { min: 0, max: DRAG_OPEN_THRESHOLD })

      // Set styling
      setStyle($additional, {
        height: clampedValue + 'px',
        opacity: clampedValue / DRAG_OPEN_THRESHOLD,
        overflow: 'hidden'
      })

      setStyle($backdrop, {
        opacity: clampedValue / DRAG_OPEN_THRESHOLD
      })

      // Open
      if (relativeY > DRAG_OPEN_THRESHOLD) {
        isDragging.value = false
        openExpanded()
      }
    }
  },
  onDragEnd({ relativeY }) {
    isDragging.value = false

    if (isExpanded.value) {
      // Handle drag end when expanded (closing) - reverse of opening logic
      if (-relativeY > DRAG_CLOSE_THRESHOLD) {
        return closeExpanded()
      }

      openExpanded()
    } else {
      // Handle drag end when collapsed (opening)
      if (relativeY > DRAG_OPEN_THRESHOLD) {
        return openExpanded()
      }

      closeExpanded()
    }
  }
})

useVerticalDrag($backdrop, {
  onDragStart() {
    additionalInfoHeight.value = unref($additional)?.clientHeight || 0
  },
  onDrag({ relativeY }) {
    const infoHeight = additionalInfoHeight.value
    const reverseDifference = infoHeight + relativeY
    const reverseThreshold = infoHeight - DRAG_CLOSE_THRESHOLD

    // Get clamp value
    const clampedValue = clampNumber(reverseDifference, { min: 0, max: infoHeight })

    // Close backdrop
    if (clampedValue < reverseThreshold) {
      backdropIsDragging.value = false

      return closeExpanded()
    }

    // Set styling
    setStyle($additional, {
      height: clampedValue + 'px',
      opacity: clampedValue / infoHeight,
      overflow: 'hidden'
    })

    setStyle($additional, {
      opacity: clampedValue / infoHeight,
    })
  },
  onDragEnd({ relativeY }) {
    // Once dragging has stopped, check if backdrop is above threshold
    const infoHeight = additionalInfoHeight.value
    const reverseDifference = infoHeight + relativeY
    const reverseThreshold = infoHeight - DRAG_CLOSE_THRESHOLD

    // Get clamp value
    const clampedValue = clampNumber(reverseDifference, { min: 0, max: infoHeight })

    // Close backdrop
    if (clampedValue < reverseThreshold) {
      backdropIsDragging.value = false

      return closeExpanded()
    }

    openExpanded()
  }
})

// Viewing badge
const { loggedIn } = useUserSession();
const { viewings, getActiveViewingForListing, getViewingStatusLabel, fetchViewings } = useViewings();

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

// Methods
function openExpanded() {
  isDragging.value = true
  isExpanded.value = true

  setStyle($additional, {
    height: '',
    opacity: 1,
    overflow: ''
  })

  setStyle($backdrop, {
    opacity: 1
  })
}

function closeExpanded() {
  isExpanded.value = false
  isDragging.value = false

  setStyle($additional, {
    height: '0px',
    opacity: 0
  })

  setStyle($backdrop, {
    opacity: 0
  })
}

function setStyle(_el: MaybeRef<HTMLElement | null>, styles: Record<string, string | number>) {
  const el = unref(_el)

  if (!isElement(el)) return

  for (let [attr, value] of Object.entries(styles)) {
    (el.style as any)[attr as string] = value
  }
}

</script>

<style lang="scss">
@use '#styles/_utils/media' as mq;
@use '#styles/_utils/functions' as fn;

.o-listing-mobile-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  background: var(--background-200);
  border-top: 1px solid var(--border-color-200);
  padding: var(--size-12) 0;
  padding-bottom: calc(var(--size-12) + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: var(--size-10);
  transition: border-radius var(--animation-slow) var(--ease-out);

  &--expanded {
    border-top-right-radius: var(--border-radius-3xl);
    border-top-left-radius: var(--border-radius-3xl);
  }

  &__drag-handle {
    --touch-overlap: calc(0px - var(--size-8));
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--size-32);
    margin-top: var(--touch-overlap);
    margin-bottom: var(--touch-overlap);
    width: 100%;
    flex-grow: 1;
    touch-action: none;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }

    &::before {
      content: '';
      width: min(80%, 8ch);
      height: var(--size-6);
      background: var(--foreground-200);
      border-radius: var(--border-radius-pill);
    }
  }


  &__additional-info {
    box-sizing: border-box;
    transition-property: padding;
    transition-duration: var(--animation-slow);
    transition-timing-function: var(--ease-out);

    @starting-style {
      height: 0;
      padding: 0;
    }

    &--expanded {
      interpolate-size: allow-keywords;

      transition-property: padding, height;
      padding: var(--size-12) 0;
    }

    @include mq.tablet {
      display: flex;
      flex-direction: row-reverse;
      gap: var(--size-24);
      margin: 0;
      width: 100%;
      max-width: none;
    }
  }

  &__additional-info-subtitle {
    @include mq.not-tablet {
      display: none;
    }
  }

  &__additional-info-address {
    color: var(--primary-400);
    margin: var(--size-8) 0;
    text-align: center;
    font-weight: 500;
  }

  &__additional-info-icons {
    height: fit-content;

    @include mq.not-tablet {
      padding: var(--size-12) var(--size-16);
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .o-listing-sidebar-icons__row {
        justify-content: center;
      }
    }
  }

  &__additional-info-pills {
    display: flex;
    justify-content: center;
    margin-top: var(--size-12);

    .sidebar-pills {
      justify-content: center;
      text-align: center;
    }
  }

  &__additional-info-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
    touch-action: none;
    border: none;
    background: light-dark(#{ fn.faded-color(30%, var(--monochrome-100))},
      #{ fn.faded-color(70%, var(--monochrome-100))});
  }

  &__grid {
    margin: var(--size-12) 0 0;

    @include mq.tablet {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--size-24);
    }
  }

  &__overview {
    margin-bottom: var(--size-6);

    @include mq.not-tablet {
      display: none;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--size-10);
    margin: 0;
    color: var(--foreground-100);

    @include mq.tablet {
      justify-content: flex-start;

      &--mobile-only {
        display: none;
      }
    }
  }

  &__title-offertype {
    background: var(--blue-400);
    color: var(--monochrome-900);
  }

  &__address {
    text-align: center;

    @include mq.tablet {
      text-align: left;
    }
  }

  &__buttons {
    margin: 0;
    flex-grow: 1;

    @include mq.tablet {
      flex-grow: 0;
    }

    .button {
      font-size: var(--font-lg);
    }
  }
}

/**
 *  Animations
 */
.o-listing-mobile-banner-enter-active,
.o-listing-mobile-banner-leave-active {
  interpolate-size: allow-keywords;

  transition: height, margin, opacity;
  transition-duration: var(--animation-medium);
  transition-timing-function: var(--ease-out);
  overflow: hidden;
}

.o-listing-mobile-banner-leave-to,
.o-listing-mobile-banner-enter-from {
  height: 0;
  margin: 0;
  opacity: 0;
}
</style>