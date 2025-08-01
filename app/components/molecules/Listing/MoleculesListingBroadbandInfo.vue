<template>
  <div class="feature-card" @click="toggleCollapse">
    <div class="feature-card__content | body-md">
      <!-- Title row with icon, title, info button, and collapse arrow -->
      <AtomsCollapsibleHeader
        :is-collapsed="isCollapsed"
        icon="listings/speed"
        title="Broadband"
        variant="inline"
        @toggle="() => {}"
      >
        <template #actions>
          <button v-if="description" @click.stop="openDescription($event)" 
            class="button button-xs button-quiet" type="button" :aria-label="`Show description for Broadband`">
            <AtomsIcon icon="property/info" :size="16" />
          </button>
        </template>
      </AtomsCollapsibleHeader>

      <!-- Broadband details (collapsible) -->
      <div v-show="!isCollapsed" class="feature-card__details-section">
        <ul class="broadband-info__list">
          <li v-if="broadbandType" class="feature-card__detail-row">
            <span class="feature-card__detail-label | body-sm">Type:</span>
            <div class="feature-card__pills">
              <AtomsPill class="body-xs">{{ formatBroadbandType(broadbandType) }}</AtomsPill>
            </div>
          </li>
          <li v-if="maxDownloadSpeedMbps" class="feature-card__detail-row">
            <span class="feature-card__detail-label | body-sm">Max Speed:</span>
            <div class="feature-card__pills">
              <AtomsPill class="body-xs">{{ maxDownloadSpeedMbps }} Mbps</AtomsPill>
            </div>
          </li>
          <li v-if="fullFibreAvailable" class="feature-card__detail-row">
            <span class="feature-card__detail-label | body-sm">Full Fibre:</span>
            <div class="feature-card__pills">
              <AtomsPill class="body-xs">Available</AtomsPill>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Description modal -->
  <AtomsInfoModal 
    :show="showDescription"
    :content="description"
    :position="modalPosition"
    @close="closeDescription"
  />
</template>

<script setup lang="ts">
interface Props {
  broadbandType?: string | null;
  maxDownloadSpeedMbps?: number | null;
  fullFibreAvailable?: boolean;
}

const props = defineProps<Props>();

// Collapse state
const isCollapsed = ref(true);

// Collapse toggle
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Description modal state
const showDescription = ref(false);
const { modalPosition, openModal, closeModal } = useInfoModal(() => {
  showDescription.value = false;
});

const openDescription = (event: MouseEvent) => {
  showDescription.value = true;
  openModal(event, -40, 8);
};

const closeDescription = () => {
  showDescription.value = false;
  closeModal();
};

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

const description = computed(() => {
  return props.broadbandType ? `information about the broadband available, including type and speed.` : '';
}); 
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.broadband-info__list {
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