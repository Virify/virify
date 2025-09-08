<template>
  <div class="recent-card-details">
    <div class="recent-card-details__price-row">
      <h3 class="recent-card-details__price | title-sm">
        {{ formattedPrice }}
      </h3>
      <AtomsPill class="recent-card-details__type-pill | body-xs">
        {{ listingTypeText }}
      </AtomsPill>
    </div>

    <address class="recent-card-details__address | body-xs">
      {{ formattedAddress }}
    </address>

    <div v-if="bedrooms || bathrooms" class="recent-card-details__features">
      <div v-if="bedrooms" class="recent-card-details__feature">
        <AtomsIcon icon="listings/beds" size="24" />
        <span class="recent-card-details__feature-text | body-xs">{{ bedrooms }}</span>
      </div>
      <div v-if="bathrooms" class="recent-card-details__feature">
        <AtomsIcon icon="listings/bathrooms" size="24" />
        <span class="recent-card-details__feature-text | body-xs">{{ bathrooms }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  price?: number;
  address?: {
    street?: string;
    city?: string;
    postcode?: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  isRental: boolean;
}

const props = defineProps<Props>();

const formattedPrice = computed(() => {
  if (!props.price) return "";
  return `£${parseInt(String(props.price)).toLocaleString()}`;
});

const formattedAddress = computed(() => {
  if (!props.address) return "Address not provided";

  const parts = [props.address.street, props.address.city, props.address.postcode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Address not provided";
});

const listingTypeText = computed(() => (props.isRental ? "Rent" : "Sale"));
</script>

<style lang="scss" scoped>
.recent-card-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-4);

  &__price-row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    margin-bottom: var(--size-4);
  }

  &__price {
    margin: 0;
    color: var(--secondary-400);
    flex: 1;
  }

  &__type-pill {
    background: var(--blue-400);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--monochrome-900);
  }

  &__address {
    font-size: 0.75rem;
    margin: 0;
    color: var(--text-muted);
    line-height: 1.4;
    font-style: normal;
  }

  &__features {
    display: flex;
    align-items: center;
    gap: var(--size-12);
    margin-top: auto;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: var(--size-4);
    color: var(--text-muted);
  }

  &__feature-text {
    font-weight: 500;
  }

  &__note {
    margin: var(--size-4) 0 0 0;
    color: var(--text-muted);
    font-style: italic;
    line-height: 1.4;
  }
}
</style>
