<template>
  <section class="o-listing-essentials">
    <h2 class="title-md">Essentials</h2>

    <div class="o-listing-essentials__grid">

      <!-- Property Information -->
      <MoleculesFeatureTile 
        v-if="listing && property"
        icon-name="property/info"
        title="Property Information" 
        subtitle="Running costs and property details"
        :pills="propertyInfoPills"
        variant="blue"
        has-background-image
      />

      <!-- Sale Information -->
      <MoleculesFeatureTile 
        v-if="listing?.saleListing"
        icon-name="listings/savings"
        title="Sale Details" 
        subtitle="Key information about this sale"
        :pills="saleInfoPills"
        variant="blue"
        has-background-image
      />

      <!-- Rental Information -->
      <MoleculesFeatureTile 
        v-if="listing?.rentalListing"
        icon-name="listings/savings"
        title="Rental Details" 
        subtitle="Terms and conditions for this rental"
        :pills="rentalInfoPills"
        variant="blue"
        has-background-image
      />


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
  return convertEnumToString(props.listing.saleListing.tenureType);
});

const formattedAvailability = computed(() => {
  if (!props.listing?.saleListing?.availabilityStatus) return '';
  return convertEnumToString(props.listing.saleListing.availabilityStatus);
});

// Computed properties for rental details formatting
const formattedRentalAvailability = computed(() => {
  if (!props.listing?.rentalListing?.availabilityStatus) return '';
  return convertEnumToString(props.listing.rentalListing.availabilityStatus);
});

const formattedRentFrequency = computed(() => {
  if (!props.listing?.rentalListing?.rentFrequency) return '';
  return convertEnumToString(props.listing.rentalListing.rentFrequency);
});

const formattedFurnishedStatus = computed(() => {
  if (props.listing?.rentalListing?.furnishedStatus === null || props.listing?.rentalListing?.furnishedStatus === undefined) return '';
  return props.listing.rentalListing.furnishedStatus ? 'Furnished' : 'Unfurnished';
});

// Computed pills arrays
const propertyInfoPills = computed(() => {
  const pills = [];
  if (props.property?.runningCosts?.councilTaxBand) {
    pills.push(`Council Tax Band ${props.property.runningCosts.councilTaxBand}`);
  }
  if (props.listing?.moveInDate) {
    pills.push(`Move in ${new Date(props.listing.moveInDate).toLocaleString('en-GB', { month: 'long' })}`);
  }
  if (props.property?.runningCosts?.groundRent) {
    pills.push(`£${parseInt(String(props.property.runningCosts.groundRent)).toLocaleString()} Ground Rent`);
  }
  if (props.property?.runningCosts?.serviceCharges) {
    pills.push(`£${parseInt(String(props.property.runningCosts.serviceCharges)).toLocaleString()} Service Charge`);
  }
  pills.push(props.property?.additionalFeatures?.petFriendly ? 'Pet Friendly' : 'No Pets');
  return pills.filter(Boolean);
});

const saleInfoPills = computed(() => {
  return [
    formattedChain.value,
    `Tenure: ${formattedTenure.value}`,
    `Availability: ${formattedAvailability.value}`
  ].filter(Boolean);
});

const rentalInfoPills = computed(() => {
  const pills = [];
  if (formattedRentalAvailability.value) {
    pills.push(`Availability: ${formattedRentalAvailability.value}`);
  }
  if (formattedRentFrequency.value) {
    pills.push(`Rent Frequency: ${formattedRentFrequency.value}`);
  }
  if (props.listing?.rentalListing?.rentalLength) {
    const label = props.listing.rentalListing.rentalLength === 'SHORT_TERM' ? 'Short-term (less than 6 months)' : 'Long-term (6+ months)';
    pills.push(`Rent Length: ${label}`);
  }
  if (props.listing?.rentalListing?.deposit) {
    pills.push(`Deposit: £${parseInt(String(props.listing.rentalListing.deposit)).toLocaleString()} deposit`);
  }
  if (formattedFurnishedStatus.value) {
    pills.push(formattedFurnishedStatus.value);
  }
  return pills.filter(Boolean);
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