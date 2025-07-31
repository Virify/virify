<template>
  <section class="o-listing-energy">
    <h3 class="o-listing-energy__title | title-md">Energy & Connectivity</h3>
    <p class="| body-md">Essential information about energy performance, heating systems, utilities, and connectivity to
      help you understand the property's running costs and convenience.</p>

    <div v-if="energyData" class="o-listing-energy__dashboard">

      <!-- Hero Section: EPC Rating + Renewable Energy -->
      <div class="o-listing-energy__hero">
        <!-- EPC Rating -->
        <div v-if="energyData.epcRating" class="o-listing-energy__epc-hero"
          :class="`o-listing-energy__epc-hero--${energyData.epcRating.toLowerCase()}`">
          <div class="o-listing-energy__epc-badge">
            <span class="o-listing-energy__epc-letter">
              {{ energyData.epcRating }}
            </span>
          </div>
          <div class="o-listing-energy__epc-info">
            <h4 class="title-sm">Energy Performance</h4>
            <p class="body-sm">EPC Rating {{ energyData.epcRating }}</p>
          </div>
        </div>

        <!-- Renewable Energy -->
        <div v-if="energyData.renewables?.length" class="o-listing-energy__renewable-hero">
          <div class="o-listing-energy__renewable-icon">
            <AtomsIcon icon="listings/eco" :size="32" />
          </div>
          <div class="o-listing-energy__renewable-info">
            <h4 class="title-sm">Renewable Energy</h4>
            <div class="o-listing-energy__renewable-pills">
              <AtomsPill v-for="renewable in energyData.renewables" :key="renewable"
                class="body-sm | o-listing-energy__renewable-pill">
                {{ formatRenewableEnergy(renewable) }}
              </AtomsPill>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface EnergyUtilitiesData {
  id: number;
  propertyId: number;
  description: string | null;
  epcRating: string;
  epcCertificateUrl: string | null;
  primaryHeatingType: string[];
  secondaryHeatingType: string[];
  boilerType: string | null;
  hotWaterSource: string | null;
  renewables: string[];
  connectedUtilities: string[];
  broadbandType: string | null;
  fullFibreAvailable: boolean;
  maxDownloadSpeedMbps: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  energyData: EnergyUtilitiesData | null;
  postcode?: string;
}

defineProps<Props>();

// Format helper function for renewable energy
const formatRenewableEnergy = (renewable: string): string => {
  return convertRoomEnumToString(renewable);
};
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.o-listing-energy {
  &__title {
    margin-bottom: var(--size-16);
  }

  &__dashboard {
    margin-top: var(--size-32);
    display: flex;
    flex-direction: column;
    gap: var(--size-32);
  }

  // Hero Section - EPC Rating + Renewable Energy
  &__hero {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--size-24);

    @include mq.tablet {
      grid-template-columns: 1fr 1fr;
    }
  }

  // EPC Rating Hero
  &__epc-hero {
    border-radius: var(--border-radius-xl);
    padding: var(--size-24);
    display: flex;
    align-items: center;
    gap: var(--size-20);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    color: var(--monochrome-900);

    @include mq.mobile-only {
      flex-direction: column;
      text-align: center;
      gap: var(--size-16);
    }

    // Rating-specific backgrounds
    &--a {
      background: linear-gradient(135deg, #00A651 0%, #00C95F 100%);
    }

    &--b {
      background: linear-gradient(135deg, #8CC63F 0%, #A3D94D 100%);
    }

    &--c {
      background: linear-gradient(135deg, #FFF200 0%, #FFFF4D 100%);
      color: #333;
    }

    &--d {
      background: linear-gradient(135deg, #F7931E 0%, #FF9E2C 100%);
    }

    &--e {
      background: linear-gradient(135deg, #ED1C24 0%, #F52A32 100%);
    }

    &--f {
      background: linear-gradient(135deg, #B71234 0%, #C91A3E 100%);
    }

    &--g {
      background: linear-gradient(135deg, #662D91 0%, #7435A3 100%);
    }

    &--unknown {
      background: linear-gradient(135deg, var(--monochrome-400) 0%, var(--monochrome-500) 100%);
    }
  }

  &__epc-badge {
    flex-shrink: 0;
  }

  &__epc-letter {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: var(--border-radius-xl);
    font-weight: 900;
    font-size: 2.5rem;
    line-height: 1;
    background: rgba(255, 255, 255, 0.2);
    color: inherit;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__epc-info {
    flex: 1;

    h4 {
      margin: 0 0 var(--size-4) 0;
      color: inherit;
    }

    p {
      margin: 0;
      color: inherit;
      opacity: 0.9;
    }
  }

  // Renewable Energy Hero
  &__renewable-hero {
    background: var(--blue-400);
    border-radius: var(--border-radius-xl);
    padding: var(--size-24);
    display: flex;
    align-items: center;
    gap: var(--size-20);
    color: var(--monochrome-900);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    
    @include mq.mobile-only {
      flex-direction: column;
      text-align: center;
      gap: var(--size-16);
    }
  }

  &__renewable-icon {
    display: flex;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius-lg);
    padding: var(--size-24);

    .a-icon {
      color: white;
    }
  }

  &__renewable-info {
    flex: 1;

    h4 {
      margin: 0 0 var(--size-8) 0;
      color: white;
    }
  }

  &__renewable-pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-4);

    @include mq.mobile-only {
      justify-content: center;
    }
  }

  &__renewable-pill {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }


}
</style>