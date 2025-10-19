<template>
  <div class="draft-card" :class="draftCardClasses">
    <div class="draft-card__main">
      <figure class="draft-card__image">
        <img 
          v-if="firstImage" 
          :src="firstImage" 
          alt="Property image"
          class="draft-card__img"
        />
        <div v-else class="draft-card__placeholder">
          <AtomsIcon icon="property/placeholder" size="32" />
        </div>
      </figure>

      <div class="draft-card__content">
        <div class="draft-card__header-row">
          <div class="draft-card__header-left">
            <h3 class="draft-card__price | title-sm">{{ formatPrice(draft.price) }}</h3>
            <div class="draft-card__badges draft-card__badges--inline">
              <AtomsPill v-if="priceTypeText" class="draft-card__pill | body-xs">{{ priceTypeText }}</AtomsPill>
              <AtomsPill class="draft-card__pill | body-xs">{{ getListingType(draft) }}</AtomsPill>
            </div>
          </div>
          <div class="draft-card__header-right">
            <AtomsPill class="draft-card__pill | body-xs">{{ tierLabel }}</AtomsPill>
          </div>
        </div>

        <address class="draft-card__address | body-xs">{{ getAddressText(draft) }}</address>

        <div class="draft-card__features" v-if="getBedrooms(draft) || getBathrooms(draft)">
          <div v-if="getBedrooms(draft)" class="draft-card__feature">
            <AtomsIcon icon="listings/beds" size="20" />
            <span class="draft-card__feature-text | body-xs">{{ getBedrooms(draft) }}</span>
          </div>
          <div v-if="getBathrooms(draft)" class="draft-card__feature">
            <AtomsIcon icon="listings/bathrooms" size="20" />
            <span class="draft-card__feature-text | body-xs">{{ getBathrooms(draft) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="draft-card__bottom">
      <div class="draft-card__left">
        <div class="draft-card__meta">
          <div class="draft-card__status">
            <span class="draft-card__date | body-xs">Updated {{ formatDate(draft.updatedAt) }}</span>
            <span class="draft-card__step | body-xs">{{ stepProgressText }}</span>
          </div>
        </div>
      </div>

      <div class="draft-card__right">
        <div class="draft-card__buttons">
          <button 
            v-if="canPublish"
            @click="$emit('publish', draft.id)" 
            class="button button-xs button-primary"
            :disabled="publishing"
            title="Publish your listing to make it searchable"
          >
            {{ publishing ? 'Publishing...' : 'Publish' }}
          </button>
          <NuxtLink :to="`/account/create-listing/${draft.id}`" class="draft-card__button-link">
            <button class="button button-xs">Edit</button>
          </NuxtLink>
          <button 
            class="button button-xs" 
            :disabled="!canPreview"
            :title="canPreview ? 'Preview your listing' : 'Complete address details (Step 4) to preview'"
            @click="canPreview && navigateTo(`/listing/preview/${draft.id}`)"
          >
            Preview
          </button>
          <button @click="$emit('delete', draft.id)" class="button button-xs" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getStepProgressText } = useListingEditor();
interface Props {
  draft: any;
  deleting?: boolean;
  publishing?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  delete: [id: number];
  publish: [id: number];
}>();

// Helper functions
const formatPrice = (price: number | null) => {
  if (!price) return 'Price not set';
  return `£${parseInt(String(price)).toLocaleString()}`;
};

const getListingType = (draft: any) => {
  if (draft.saleListing) return 'For Sale';
  if (draft.rentalListing) return 'To Rent';
  return 'Type not set';
};

const getAddressText = (draft: any) => {
  const address = draft.property?.address;
  if (!address) return 'Address not set';
  return [address.street, address.city, address.postcode].filter(Boolean).join(', ') || 'Address not set';
};

const getBedrooms = (draft: any) => {
  return draft.property?.numberBedrooms || 0;
};

const getBathrooms = (draft: any) => {
  return draft.property?.numberBathrooms || 0;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Get first image from media
const firstImage = computed(() => {
  const config = useRuntimeConfig();
  const media = props.draft.property?.media;
  if (!media || media.length === 0) return null;
  
  const firstMedia = media[0];
  if (!firstMedia.image) return null;
  
  // Build Cloudflare image URL with thumbnail variant
  return `https://imagedelivery.net/${config.public.CF_ACCOUNT_HASH}/${firstMedia.image}/thumbnail`;
});

// Tier-based computed properties (matching OrganismsAccountOwnListingCard)
const priceTypeText = computed(() =>
  convertEnumToString(props.draft.saleListing?.priceType || props.draft.rentalListing?.rentFrequency || "").toLowerCase()
);

const tierKey = computed(() => String(props.draft.listingTier || "").toLowerCase());

const tierLabel = computed(() => {
  const key = tierKey.value;
  if (key === "premium") return "Premium";
  if (key === "featured") return "Featured";
  return "Basic";
});

const draftCardClasses = computed(() => ({
  'draft-card--premium': tierKey.value === 'premium',
  'draft-card--featured': tierKey.value === 'featured',
  'draft-card--basic': !tierKey.value || tierKey.value === 'basic'
}));

// Get step progress from composable
const stepProgressText = computed(() => {
  if (!props.draft?.id) return 'Not started';
  return getStepProgressText(props.draft.id).value;
});

// Check if preview is available (step 4 must be complete - address must be set)
const canPreview = computed(() => {
  return stepFourValidation.hasExistingStepFourData(props.draft);
});

// Check if all 10 steps are complete for publishing
const canPublish = computed(() => {
  const completedSteps = props.draft?.completedSteps || [];
  return completedSteps.length === 10 && completedSteps.every((step: number) => step >= 1 && step <= 10);
});

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.draft-card {
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
      align-items: flex-start;
      gap: var(--size-8);
      flex-wrap: nowrap;
    }

    // Make content flexible and allow wrapping next to image
    > :first-child {
      flex: 0 0 auto;
    }

    >.draft-card__content {
      flex: 1 1 320px;
      min-width: 260px;
    }

    @include mq.mobile-only {
      > :first-child {
        width: 100%;
      }

      >.draft-card__content {
        flex: 0 1 auto;
        min-width: 0;
        width: 100%;
      }
    }
  }

  &__image {
    width: 120px;
    flex: 0 0 120px;
    height: 100%;
    box-sizing: border-box;
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    position: relative;
    margin: 0;
    background: var(--background-200);
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 4 / 3;

    @include mq.mobile-only {
      width: 100%;
      flex: 0 0 auto;
      aspect-ratio: 16 / 9;
      height: auto;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--monochrome-600);
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
      justify-content: flex-start;
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
    color: var(--tier-color, var(--secondary-400));
  }

  &__badges {
    display: inline-flex;
    gap: var(--size-4);
    flex-wrap: wrap;
  }

  &__pill {
    background: var(--tier-color, var(--secondary-400));
    color: var(--background-100);
    text-transform: capitalize;

    &--draft {
      background: var(--accent-400);
      color: var(--background-100);
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

  &__meta {
    display: flex;
    flex-direction: column;
    gap: var(--size-4);
    color: var(--text-muted);
  }

  &__status {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    flex-wrap: wrap;
  }

  &__date {
    color: var(--text-muted);
  }

  &__step {
    color: var(--text-muted);
    padding-left: var(--size-8);
    border-left: 1px solid var(--monochrome-500);
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

  &__button-link {
    text-decoration: none;
    display: inline-flex;
  }

  /* Buttons should use tier color */
  .button {
    color: var(--background-100);

    &:hover,
    &:focus {
      filter: brightness(0.95);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* Tier color themes */
  &.draft-card--premium {
    --tier-color: var(--blue-400);

    .button {
      color: var(--monochrome-900);
      background-color: var(--tier-color);
      border-color: var(--tier-color);
    }

    .draft-card__price {
      color: var(--foreground-100);
    }

    .draft-card__pill,
    .draft-card__pill--active {
      color: var(--monochrome-900);
    }
  }

  &.draft-card--featured {
    --tier-color: var(--secondary-400);

    .button {
      background-color: var(--tier-color);
      border-color: var(--tier-color);
    }
  }

  &.draft-card--basic {
    --tier-color: var(--foreground-100);

    .button {
      background-color: var(--tier-color);
      border-color: var(--tier-color);
    }
  }
}
</style>