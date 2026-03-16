<template>
  <div class="own-card" :class="ownCardClasses">
    <div class="own-card__main">
      <AtomsAccountListingCardImage :image-src="firstImage" :has-note="false" />

      <div class="own-card__content">
        <div class="own-card__header-row">
          <div class="own-card__header-left">
            <h3 class="own-card__price | title-sm">{{ priceFormatted }}</h3>
            <div class="own-card__badges own-card__badges--inline">
              <AtomsPill v-if="priceTypeText" class="own-card__pill | body-xs">{{ priceTypeText }}</AtomsPill>
              <AtomsPill class="own-card__pill | body-xs">{{ isRental ? "Rent" : "Sale" }}</AtomsPill>
            </div>
          </div>
          <div class="own-card__header-right">
            <AtomsPill class="own-card__pill | body-xs">{{ tierLabel }}</AtomsPill>
          </div>
        </div>

        <address class="own-card__address | body-xs">{{ addressText }}</address>

        <div class="own-card__features" v-if="bedrooms || bathrooms">
          <div v-if="bedrooms" class="own-card__feature">
            <AtomsIcon icon="listings/beds" size="20" />
            <span class="own-card__feature-text | body-xs">{{ bedrooms }}</span>
          </div>
          <div v-if="bathrooms" class="own-card__feature">
            <AtomsIcon icon="listings/bathrooms" size="20" />
            <span class="own-card__feature-text | body-xs">{{ bathrooms }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="own-card__bottom">
      <div class="own-card__left">
        <div class="own-card__toggle">
          <label class="switch" :class="{ 'switch--disabled': item.archived }">
            <input type="checkbox" :checked="item.published" :disabled="item.archived" @change="onTogglePublish"
              :aria-label="item.archived ? 'Cannot publish archived listing' : (item.published ? 'Unpublish listing' : 'Publish listing')" />
            <span class="slider"></span>
          </label>
          <span class="body-xs">{{ item.archived ? "Archived" : (item.published ? "Published" : "Unpublished") }}</span>
        </div>

        <div class="own-card__analytics">
          <div class="own-card__metric" title="Views">
            <AtomsIcon icon="visible" size="22" />
            <span class="body-xs">{{ item.analytics.viewsCount }}</span>
          </div>
          <div class="own-card__metric" title="Favourited">
            <AtomsIcon icon="cards/favourite" size="22" />
            <span class="body-xs">{{ item.analytics.favouritesCount }}</span>
          </div>
          <div class="own-card__metric" title="Enquiries">
            <AtomsIcon icon="account/enquiry" size="22" />
            <span class="body-xs">{{ item.analytics.enquiriesCount }}</span>
          </div>
          <AtomsPill v-if="!item.isDraft"
            :class="['own-card__pill', item.published ? 'own-card__pill--active' : 'own-card__pill--inactive']"
            class="body-xs">
            {{ item.published ? "Active" : "Inactive" }}
          </AtomsPill>
        </div>
      </div>

      <div class="own-card__right">
        <AtomsPill v-if="item.isDraft" class="own-card__pill own-card__pill--draft | body-xs">Draft</AtomsPill>
        <div class="own-card__buttons">
          <NuxtLink :to="editHref">
            <button class="button button-xs">Edit</button>
          </NuxtLink>
          <NuxtLink :to="item.published ? viewHref : undefined" :class="{ 'disabled-link': !item.published }">
            <button class="button button-xs" :disabled="!item.published">View</button>
          </NuxtLink>
          <button v-if="!item.isDraft" class="button button-xs button-danger" @click="handleArchive">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OwnedListingWithAnalytics } from "~~/shared/types/user-owned-listing";

const props = defineProps<{ item: OwnedListingWithAnalytics }>();

const { archiveListing } = useMyListings();

const isRental = computed(() => !!props.item.rentalListing)
const priceFormatted = computed(() =>
  props.item.price != null ? `£${parseInt(String(props.item.price)).toLocaleString()}` : ""
)
const priceTypeText = computed(() =>
  convertEnumToString(props.item.saleListing?.priceType || props.item.rentalListing?.rentFrequency || "").toLowerCase()
)
const addressText = computed(() => {
  const address = props.item.property?.address
  if (!address) return ""
  return [address.street, address.city, address.postcode].filter(Boolean).join(", ")
})
const bedrooms = computed(() => props.item.property?.numberBedrooms || 0)
const bathrooms = computed(() => props.item.property?.numberBathrooms || 0)
const firstImage = computed(() => getMainImage(props.item.property))
const viewHref = computed(() => `/listing/${props.item.id}`)

// Edit link - different for drafts vs live listings
const editHref = computed(() => {
  if (props.item.isDraft) {
    return `/account/create-listing/${props.item.id}`
  }
  return `/account/edit-listing/${props.item.id}`
})

const tierKey = computed(() => String(props.item.listingTier || "").toLowerCase())

const tierLabel = computed(() => {
  const key = tierKey.value
  if (key === "premium") return "Premium"
  if (key === "featured") return "Featured"
  return "Basic"
})
const ownCardClasses = computed(() => ({
  'own-card--premium': tierKey.value === 'premium',
  'own-card--featured': tierKey.value === 'featured',
  'own-card--basic': !tierKey.value || tierKey.value === 'basic'
}))

const onTogglePublish = () => {
  const { togglePublished } = useMyListings()
  togglePublished(props.item.id, props.item.published)
}

const handleArchive = async () => {
  if (!confirm('Are you sure you want to archive this listing? This will unpublish it and mark it as archived.')) {
    return
  }

  try {
    await archiveListing(props.item.id)
  } catch (error) {
    console.error('Failed to archive listing:', error)
  }
}
</script>

<style lang="scss" scoped>
@use "#styles/_utils/media" as mq;

.own-card {
  width: 100%;
  background: var(--background-100);
  border: 1px solid var(--monochrome-500);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  padding: var(--size-12);
  box-sizing: border-box;

  &__main {
    display: flex;
    width: 100%;
    gap: var(--size-12);
    align-items: stretch;
    flex-wrap: wrap;

    // On narrow screens, stack image above content
    @include mq.mobile-only {
      flex-direction: column;
      align-items: flex-start; // avoid stretching children vertically
      gap: var(--size-8);
      flex-wrap: nowrap; // prevent wrap creating large vertical gaps
    }

    // Make content flexible and allow wrapping next to image
    > :first-child {
      flex: 0 0 auto;
    }

    >.own-card__content {
      flex: 1 1 320px;
      min-width: 260px;
    }

    @include mq.mobile-only {
      > :first-child {
        width: 100%;
      }

      >.own-card__content {
        flex: 0 1 auto; // don't force extra height on mobile
        min-width: 0;
        width: 100%;
      }
    }
  }

  &__content {
    flex: 1 1 320px;
    display: flex;
    flex-direction: column;
    gap: var(--size-8);

    @include mq.mobile-only {
      flex: 0 1 auto;
    }
  }

  &__header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--size-8);

    @include mq.mobile-only {
      justify-content: flex-start; // keep items together
      flex-wrap: wrap;
      gap: var(--size-8);
    }
  }

  &__header-left {
    align-items: center;
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--size-8);

    @include mq.mobile-only {
      order: 1;
    }
  }

  &__header-right {
    align-items: center;
    display: inline-flex;

    @include mq.mobile-only {
      order: 2;
    }
  }

  &__badges--inline {
    display: inline-flex;
    align-items: center;
    gap: var(--size-4);
  }

  &__price {
    margin: 0;
    color: var(--tier-color, var(--primary-400));
  }

  &__badges {
    display: inline-flex;
    gap: var(--size-4);
    flex-wrap: wrap;
  }

  &__pill {
    background: var(--tier-color, var(--primary-400));
    color: var(--background-200);
    text-transform: capitalize;

    &--draft {
      background: var(--accent-400);
    }

    &--active {
      background: var(--tier-color, var(--primary-400));
      color: var(--background-200);
    }

    &--inactive {
      background: var(--monochrome-500);
      color: var(--monochrome-900);
    }
  }

  &__address {
    margin: 0;
    color: var(--text-muted);
    font-style: normal;
  }

  &__features {
    display: flex;
    gap: var(--size-12);
    flex-wrap: wrap;
  }

  &__feature {
    display: flex;
    gap: var(--size-4);
    align-items: center;
    color: var(--text-muted);
  }

  &__feature-text {
    font-weight: 600;
  }

  &__analytics {
    display: flex;
    gap: var(--size-16);
    color: var(--text-muted);
    flex-wrap: wrap;
  }

  &__metric {
    display: inline-flex;
    gap: var(--size-4);
    align-items: center;
  }

  &__bottom {
    margin-top: var(--size-12);
    display: flex;
    gap: var(--size-12);
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;

    @include mq.mobile-only {
      gap: var(--size-8);
      row-gap: var(--size-8);
    }
  }

  &__left {
    align-items: center;
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--size-16);

    @include mq.mobile-only {
      gap: var(--size-8);
    }
  }

  &__right {
    align-items: center;
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--size-12);
    justify-content: flex-end;
    margin-left: auto;

    @include mq.mobile-only {
      gap: var(--size-8);
      justify-content: flex-start;
      margin-left: 0;
      width: 100%;
    }
  }

  &__buttons {
    display: inline-flex;
    gap: var(--size-8);
    flex-wrap: wrap;
  }

  /* Buttons should use tier color */
  .button {
    color: var(--background-200);
  }

  .button:hover,
  .button:focus {
    filter: brightness(0.95);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .disabled-link {
    pointer-events: none;
  }

  /* Tier color themes */
  &.own-card--premium {
    --tier-color: var(--blue-500);

    .button {
      color: var(--monochrome-900);
      background-color: var(--tier-color);
      border-color: var(--tier-color);
    }

    .own-card__price {
      color: var(--foreground-100);
    }

    .own-card__pill,
    .own-card__pill--active {
      color: var(--monochrome-900);
    }

    /* Make toggle darker for premium tier */
    input:checked+.slider {
      background-color: var(--blue-500);
    }
  }

  &.own-card--featured {
    --tier-color: var(--primary-400);

    .button {
      background-color: var(--tier-color);
      border-color: var(--tier-color);
    }
  }

  &.own-card--basic {
    --tier-color: var(--foreground-100);

    .button {
      background-color: var(--tier-color);
      border-color: var(--tier-color);
    }

    /* Make toggle more visible for basic tier */
    input:checked+.slider {
      background-color: var(--monochrome-100);
    }
  }

  &__toggle {
    display: inline-flex;
    gap: var(--size-8);
    align-items: center;
  }
}

/* simple switch */
.switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;

    .slider {
      cursor: not-allowed;
    }
  }
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;

  &:disabled+.slider {
    cursor: not-allowed;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--monochrome-500);
  transition: 0.2s;
  border-radius: 20px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: var(--tier-color, var(--primary-400));
}

input:checked+.slider:before {
  transform: translateX(14px);
}
</style>
