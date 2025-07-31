<template>
  <div class="feature-card" @click="toggleCollapse">
    <div class="feature-card__content | body-md">
      <!-- Title row with icon, title, info button, and collapse arrow -->
      <AtomsCollapsibleHeader
        :is-collapsed="isCollapsed"
        icon="property/work"
        title="Connectivity"
        variant="inline"
        @toggle="() => {}"
      />

      <!-- Connectivity details (collapsible) -->
      <div v-show="!isCollapsed" class="feature-card__details-section">
        <!-- Broadband -->
        <div class="feature-card__details-group">
          <h6 class="feature-card__group-title | body-sm font-semibold">Broadband</h6>
          <ul class="connectivity-info__list">
            <li v-if="energyData.broadbandType" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Type:</span>
              <div class="feature-card__pills">
                <AtomsPill class="body-xs">{{ formatBroadbandType(energyData.broadbandType) }}</AtomsPill>
              </div>
            </li>
            <li v-if="energyData.maxDownloadSpeedMbps" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Max Speed:</span>
              <div class="feature-card__pills">
                <AtomsPill class="body-xs">{{ energyData.maxDownloadSpeedMbps }} Mbps</AtomsPill>
              </div>
            </li>
            <li v-if="energyData.fullFibreAvailable" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Full Fibre:</span>
              <div class="feature-card__pills">
                <AtomsPill class="body-xs">Available</AtomsPill>
              </div>
            </li>
          </ul>
        </div>

        <!-- Mobile Coverage -->
        <div class="feature-card__details-group">
          <h6 class="feature-card__group-title | body-sm font-semibold">Mobile Coverage</h6>
          <ul class="connectivity-info__list">
            <li v-for="network in mobileNetworks" :key="network.name" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">{{ network.name }}:</span>
              <div class="feature-card__pills">
                <AtomsPill class="body-xs">{{ network.coverage }}</AtomsPill>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EnergyData {
  broadbandType?: string | null;
  maxDownloadSpeedMbps?: number | null;
  fullFibreAvailable?: boolean;
}

interface Props {
  energyData: EnergyData;
}

defineProps<Props>();

// Collapse state
const isCollapsed = ref(true);

// Collapse toggle
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Default mobile networks data (placeholder)
const mobileNetworks = [
  { name: 'EE', coverage: 'Excellent' },
  { name: 'O2', coverage: 'Good' },
  { name: 'Vodafone', coverage: 'Fair' },
  { name: 'Three', coverage: 'Poor' }
];

const formatBroadbandType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'ADSL': 'ADSL',
    'FTTC': 'Fibre to the Cabinet',
    'FTTP': 'Fibre to the Premises',
    'CABLE': 'Cable',
    'MOBILE': 'Mobile',
    'UNKNOWN': 'Unknown'
  };
  return typeMap[type] || convertEnumToString(type);
};
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.connectivity-info__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-8);
}

.feature-card {
  background: var(--background-100);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--monochrome-600);
  box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;

  &__content {
    padding: var(--size-16);
    width: 100%;
  }

  &__details-section {
    margin-top: var(--size-16);
    display: flex;
    flex-direction: column;
    gap: var(--size-16);
  }

  &__details-group {
    &:not(:last-child) {
      border-bottom: 1px solid var(--border-color-100);
      padding-bottom: var(--size-12);
    }
  }

  &__group-title {
    margin: 0 0 var(--size-8) 0;
    color: var(--foreground-100);
  }

  &__detail-row {
    display: flex;
    align-items: center;
    gap: var(--size-8);
    min-height: var(--size-20);

    @include mq.mobile-only {
      flex-wrap: wrap;
      gap: var(--size-4);
    }
  }

  &__detail-label {
    color: var(--foreground-100);
    flex-shrink: 0;
    min-width: 70px;
  }

  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-4);

    .a-pill {
      background: var(--blue-400);
      color: white;
    }
  }

  .a-icon {
    width: 22px;
    height: 22px;
    color: var(--foreground-100);
  }
}
</style>