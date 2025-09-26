<template>
  <div class="account-card-details">
    <div class="account-card-details__price-row">
      <h3 class="account-card-details__price | title-sm">{{ formattedPrice }}</h3>
      <div class="account-card-details__actions">
        <slot name="after-pill" />
      </div>
    </div>

    <div class="account-card-details__pills" v-if="listingTypeText || priceType">
      <AtomsPill v-if="listingTypeText" class="account-card-details__type-pill | body-xs">{{ listingTypeText }}
      </AtomsPill>
      <AtomsPill v-if="priceType" class="account-card-details__type-pill | body-xs">{{
        formattedPriceType.toLocaleLowerCase() }}</AtomsPill>
    </div>

    <address class="account-card-details__address | body-xs">{{ formattedAddress }}</address>

    <div v-if="bedrooms || bathrooms" class="account-card-details__features">
      <div v-if="bedrooms" class="account-card-details__feature">
        <AtomsIcon icon="listings/beds" size="24" />
        <span class="account-card-details__feature-text | body-xs">{{ bedrooms }}</span>
      </div>
      <div v-if="bathrooms" class="account-card-details__feature">
        <AtomsIcon icon="listings/bathrooms" size="24" />
        <span class="account-card-details__feature-text | body-xs">{{ bathrooms }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  price?: number;
  priceType?: string;
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

const formattedPriceType = computed(() => {
  return convertEnumToString(props.priceType || "");
});
const formattedAddress = computed(() => {
  if (!props.address) return "Address not provided";

  const parts = [props.address.street, props.address.city, props.address.postcode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Address not provided";
});

const listingTypeText = computed(() => (props.isRental ? "Rent" : "Sale"));
</script>

<style lang="scss" scoped>
.account-card-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
  justify-content: space-between;

  &__price-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--size-8);
    margin: 0;
    width: 100%;
    min-width: 0;
  }

  &__actions {
    display: inline-flex;
    align-items: baseline;
    gap: var(--size-4);
    flex-shrink: 0;
    padding-right: var(--size-2);
  }

  &__price {
    margin: 0;
    color: var(--secondary-400);
    flex: 1;
    min-width: 0;
  }

  &__type-pill {
    background: var(--secondary-400);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--monochrome-900);
    text-transform: capitalize;
  }

  &__pills {
    display: inline-flex;
    gap: var(--size-4);
    margin-top: var(--size-2);
    flex-wrap: wrap;
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
