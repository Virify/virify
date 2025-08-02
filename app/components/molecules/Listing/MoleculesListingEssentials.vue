<template>
  <section class="o-listing-essentials">
    <h2 class="title-md">Essentials</h2>

    <div class="o-listing-essentials__grid">

      <!-- Property Information -->
      <div v-if="listing && property" class="o-listing-essentials__card o-listing-essentials__card">
        <div class="o-listing-essentials__header">
          <div class="o-listing-essentials__icon">
            <AtomsIcon icon="property/info" :size="32" />
          </div>
          <div class="o-listing-essentials__header-text">
            <h4 class="title-sm">Property Information</h4>
            <p class="body-xs">Running costs and property details</p>
          </div>
        </div>
        <div class="o-listing-essentials__pills">
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Council Tax Band &nbsp;<strong>{{ property?.runningCosts?.councilTaxBand }}</strong>
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Move in &nbsp; <strong>{{ new Date(listing?.moveInDate!).toLocaleString('en-GB', { month: 'long' })
            }}</strong>
          </AtomsPill>
          <AtomsPill v-if="property?.runningCosts?.groundRent" class="body-sm | o-listing-essentials__pill">
            <strong>£{{ parseInt(String(property?.runningCosts?.groundRent)).toLocaleString() }}</strong>&nbsp;Ground
            Rent
          </AtomsPill>
          <AtomsPill v-if="property?.runningCosts?.serviceCharges" class="body-sm | o-listing-essentials__pill">
            £{{ parseInt(String(property?.runningCosts?.serviceCharges)).toLocaleString() }} Service Charge
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            {{ property?.additionalFeatures?.petFriendly ? 'Pet Friendly' : 'No Pets' }}
          </AtomsPill>
        </div>
      </div>

      <!-- Sale Information -->
      <div v-if="listing?.saleListing" class="o-listing-essentials__card o-listing-essentials__card-">
        <div class="o-listing-essentials__header">
          <div class="o-listing-essentials__icon">
            <AtomsIcon icon="listings/savings" :size="32" />
          </div>
          <div class="o-listing-essentials__header-text">
            <h4 class="title-sm">Sale Details</h4>
            <p class="body-xs">Key information about this sale</p>
          </div>
        </div>
        <div class="o-listing-essentials__pills">
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            {{ formattedChain }}
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Tenure: {{ formattedTenure }}
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Availability: {{ formattedAvailability }}
          </AtomsPill>
        </div>
      </div>

      <!-- Rental Information -->
      <div v-if="listing?.rentalListing" class="o-listing-essentials__card o-listing-essentials__card">
        <div class="o-listing-essentials__header">
          <div class="o-listing-essentials__icon">
            <AtomsIcon icon="listings/savings" :size="32" />
          </div>
          <div class="o-listing-essentials__header-text">
            <h4 class="title-sm">Rental Details</h4>
            <p class="body-xs">Terms and conditions for this rental</p>
          </div>
        </div>
        <div class="o-listing-essentials__pills">
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Availability: {{ formattedRentalAvailability }}
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Rent Frequency: {{ formattedRentFrequency }}
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Rent Length: {{ listing?.rentalListing?.rentalLength }} months
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            Deposit: £{{ parseInt(String(listing?.rentalListing?.deposit)).toLocaleString() }} deposit
          </AtomsPill>
          <AtomsPill class="body-sm | o-listing-essentials__pill">
            {{ formattedFurnishedStatus }}
          </AtomsPill>
        </div>
      </div>


    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  listing: any;
  property: any;
}

const props = defineProps<Props>();

// Computed properties for sale details formatting
const formattedChain = computed(() => {
  if (props.listing?.saleListing?.chain === null || props.listing?.saleListing?.chain === undefined) return '';
  return props.listing.saleListing.chain ? 'Chain Free' : 'Chain Dependent';
});

const formattedTenure = computed(() => {
  if (!props.listing?.saleListing?.tenureType) return '';
  return convertRoomEnumToString(props.listing.saleListing.tenureType);
});

const formattedAvailability = computed(() => {
  if (!props.listing?.saleListing?.availabilityStatus) return '';
  return convertRoomEnumToString(props.listing.saleListing.availabilityStatus);
});

// Computed properties for rental details formatting
const formattedRentalAvailability = computed(() => {
  if (!props.listing?.rentalListing?.availabilityStatus) return '';
  return convertRoomEnumToString(props.listing.rentalListing.availabilityStatus);
});

const formattedRentFrequency = computed(() => {
  if (!props.listing?.rentalListing?.rentFrequency) return '';
  return convertRoomEnumToString(props.listing.rentalListing.rentFrequency);
});

const formattedFurnishedStatus = computed(() => {
  if (props.listing?.rentalListing?.furnishedStatus === null || props.listing?.rentalListing?.furnishedStatus === undefined) return '';
  return props.listing.rentalListing.furnishedStatus ? 'Furnished' : 'Unfurnished';
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-listing-essentials {
  h2 {
    margin-bottom: var(--size-16);
  }

  p {
    margin-bottom: var(--size-32);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);

    @include mq.tablet {
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    }
  }

  &__card {
    border-radius: var(--border-radius-xl);
    padding: var(--size-24);
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: var(--monochrome-900);
    background: url('/img/logo-background.svg') no-repeat bottom right, var(--blue-400);
    background-size: auto 150%, cover;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: var(--size-12);
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-lg);
    padding: var(--size-24);

    .a-icon {
      color: var(--monochrome-900);
    }
  }

  &__header-text {
    flex: 1;

    h4 {
      margin: 0;
      color: var(--monochrome-900);
    }

    p {
      margin: 0;
      color: var(--monochrome-900);
      opacity: 0.8;
    }
  }

  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);

    @include mq.mobile-only {
      justify-content: center;
    }
  }

  &__pill {
    background: rgba(255, 255, 255, 0.2);
    color: var(--monochrome-900);
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}
</style>