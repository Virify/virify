<template>
  <div class="feature-card" @click="toggleCollapse">
    <div class="feature-card__content | body-md">
      <!-- Title row with icon, title, info button, and collapse arrow -->
      <AtomsCollapsibleHeader
        :is-collapsed="isCollapsed"
        icon="property/utility"
        title="Energy"
        variant="inline"
        @toggle="() => {}"
      >
        <template #actions>
          <AtomsTooltip v-if="description" :responsive="true">
            <AtomsIcon icon="property/info" :size="16" />
            <template #tooltip>
              <p class="body-xs">{{ description }}</p>
            </template>
          </AtomsTooltip>
        </template>
      </AtomsCollapsibleHeader>

      <!-- Energy details (collapsible) -->
      <div v-show="!isCollapsed" class="feature-card__details-section">
        <!-- Heating & Hot Water -->
        <div v-if="energyData?.primaryHeatingType?.length || energyData?.boilerType" class="feature-card__details-group">
          <h6 class="feature-card__group-title | body-sm font-semibold">Heating & Hot Water</h6>
          <ul class="energy-info__list">
            <li v-if="energyData.primaryHeatingType?.length" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Primary:</span>
              <div class="feature-card__pills">
                <AtomsPill v-for="heating in energyData.primaryHeatingType" :key="heating" class="body-xs">
                  {{ formatHeatingType(heating) }}
                </AtomsPill>
              </div>
            </li>
            <li v-if="energyData.secondaryHeatingType?.length" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Secondary:</span>
              <div class="feature-card__pills">
                <AtomsPill v-for="heating in energyData.secondaryHeatingType" :key="heating" class="body-xs">
                  {{ formatHeatingType(heating) }}
                </AtomsPill>
              </div>
            </li>
            <li v-if="energyData.boilerType" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Boiler:</span>
              <div class="feature-card__pills">
                <AtomsPill class="body-xs">{{ formatBoilerType(energyData.boilerType) }}</AtomsPill>
              </div>
            </li>
            <li v-if="energyData.hotWaterSource" class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Hot Water:</span>
              <div class="feature-card__pills">
                <AtomsPill class="body-xs">{{ formatHotWaterSource(energyData.hotWaterSource) }}</AtomsPill>
              </div>
            </li>
          </ul>
        </div>

        <!-- Utilities -->
        <div v-if="energyData?.connectedUtilities?.length" class="feature-card__details-group">
          <h6 class="feature-card__group-title | body-sm font-semibold">Connected Utilities</h6>
          <ul class="energy-info__list">
            <li class="feature-card__detail-row">
              <span class="feature-card__detail-label | body-sm">Available:</span>
              <div class="feature-card__pills">
                <AtomsPill v-for="utility in energyData.connectedUtilities" :key="utility" class="body-xs">
                  {{ formatUtility(utility) }}
                </AtomsPill>
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
  primaryHeatingType?: string[];
  secondaryHeatingType?: string[];
  boilerType?: string | null;
  hotWaterSource?: string | null;
  connectedUtilities?: string[];
}

interface Props {
  title?: string;
  energyData?: EnergyData;
}

defineProps<Props>();

// Collapse state - open by default
const isCollapsed = ref(false);

// Collapse toggle
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const description = computed(() => {
  return 'This section provides information about the energy efficiency and utilities available for the property.';
});

// Format helper functions
const formatHeatingType = (type: string): string => {
  return convertRoomEnumToString(type);
};

const formatBoilerType = (type: string): string => {
  return convertRoomEnumToString(type);
};

const formatHotWaterSource = (source: string): string => {
  return convertRoomEnumToString(source);
};

const formatUtility = (utility: string): string => {
  return convertRoomEnumToString(utility);
};
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.energy-info__list {
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
      color: var(--monochrome-900);
    }
  }

  .a-icon {
    width: 22px;
    height: 22px;
    color: var(--foreground-100);
  }
}
</style>