<template>
  <div class="feature-card" @click="toggleCollapse">
    <div class="feature-card__content | body-md">
      <!-- Title row with icon, title, info button, and collapse arrow -->
      <AtomsCollapsibleHeader
        :is-collapsed="isCollapsed"
        :icon="getFeatureIcon(title)"
        :title="title"
        variant="inline"
        @toggle="() => {}"
      >
        <template #actions>
          <button v-if="features?.description" @click.stop="openDescription($event)" 
            class="button button-xs button-quiet" type="button" :aria-label="`Show description for ${title}`">
            <AtomsIcon icon="property/info" :size="16" />
          </button>
        </template>
      </AtomsCollapsibleHeader>

      <!-- Size and features row (collapsible) -->
      <div v-show="!isCollapsed" class="feature-card__details-row">
        <div v-if="features?.size" class="feature-card__size">
          <AtomsIcon icon="property/size" :size="24" />
          {{ formattedSize }}sqmt
        </div>

        <div v-if="filteredFeatures.length > 0" class="feature-card__features">
          <AtomsIcon icon="property/feature" :size="24" />
          <div class="feature-card__pills">
            <AtomsPill v-for="feature in filteredFeatures" :key="feature" class="| body-xs">
              {{ feature }}
            </AtomsPill>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Description modal -->
  <AtomsInfoModal 
    :show="showDescription" 
    :content="features?.description || ''" 
    :position="modalPosition"
    @close="closeDescription"
  />
</template>

<script setup lang="ts">

interface Props {
  title: string;
  features: Record<string, any> | null | undefined;
}

const props = defineProps<Props>();

// Computed property to filter only TRUE boolean features and convert to readable strings
const filteredFeatures = computed(() => {
  if (!props.features || typeof props.features !== 'object') return [];

  const features: string[] = [];

  Object.entries(props.features).forEach(([key, value]) => {
    // Skip non-boolean properties or specific properties we handle separately
    if (typeof value === 'boolean' && value === true && key !== 'description' && key !== 'size') {
      features.push(convertRoomEnumToString(key));
    }
  });

  return features;
});

// Collapse state
const isCollapsed = ref(true);

// Description modal state
const showDescription = ref(false);
const { modalPosition, openModal, closeModal } = useInfoModal(() => {
  showDescription.value = false;
});

// Helper function to get feature icon based on title
const getFeatureIcon = (title: string): string => {
  // Convert title to lowercase for mapping
  const titleLower = title.toLowerCase();
  return getFeatureTypeIcon(titleLower);
};

const formattedSize = computed(() => {
  return Math.round(props.features?.size || 0);
});

// Description modal methods
const openDescription = (event: MouseEvent) => {
  showDescription.value = true;
  openModal(event, -200, 8);
};

const closeDescription = () => {
  showDescription.value = false;
  closeModal();
};

// Collapse toggle
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

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


  &__details-row {
    display: flex;
    align-items: center;
    gap: var(--size-16);
    margin-top: var(--size-8);
  }

  &__size {
    display: flex;
    align-items: center;
    gap: var(--size-8);
  }

  &__features {
    display: flex;
    align-items: flex-start;
    gap: var(--size-4);

    .a-icon {
      margin-top: 3px;
      flex-shrink: 0;
    }
  }

  &__pills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-4);

    .a-pill {
      background: var(--background-300);
      color: var(--foreground-100);
    }
  }


  .a-icon {
    color: var(--foreground-200);
    width: auto;
    height: auto;
  }
}
</style>