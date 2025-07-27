<template>
  <!-- Feature details card -->
  <div class="feature-details">
    <!-- Feature card -->
    <div class="feature-details__item">

      <!-- Feature content -->
      <div class="feature-details__item-content | body-sm">

        <!-- Feature type header with icon and info button -->
        <p class="feature-details__item-content-type | font-semibold">
          <span class="feature-details__item-title-wrapper">
            <AtomsIcon :icon="getFeatureIcon(title)" :size="20" class="feature-details__type-icon" />
            {{ title }}
          </span>
          <!-- Info button to show description modal (only if description exists) -->
          <button v-if="features?.description" @click="toggleDescription($event)" class="button button-xs button-quiet"
            type="button" :aria-label="`Show description for ${title}`">
            <AtomsIcon icon="property/info" :size="18" />
          </button>
        </p>

        <!-- Feature size (only if size exists) -->
        <p v-if="features?.size" class="feature-details__item-detail">
          <AtomsIcon icon="property/size" :size="24" class="feature-details__icon" />
          {{ formattedSize }}sqmt
        </p>

        <!-- Feature boolean features as pills (only if features exist) -->
        <div class="feature-details__item-features" v-if="filteredFeatures.length > 0">
          <AtomsIcon icon="property/feature" :size="24" class="feature-details__icon" />
          <div class="feature-details__item-features-pills">
            <AtomsPill v-for="feature in filteredFeatures" :key="feature" class="| body-xs">
              {{ feature }}
            </AtomsPill>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Description modal teleported to body for proper positioning -->
  <Teleport to="body">
    <div v-if="showDescription && features?.description" class="feature-description-modal" :style="modalPosition"
      @click.stop>
      <!-- Feature description text -->
      <p class="| body-xs">{{ features.description }}</p>
      <!-- Close button -->
      <button @click="closeDescription" class="feature-description-modal__close" type="button"
        aria-label="Close description">
        <AtomsIcon icon="property/close" :size="14" />
      </button>
    </div>
  </Teleport>

</template>

<script setup lang="ts">
import { convertEnumToString } from '~/utils/listing/room-config';

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
      features.push(convertEnumToString(key));
    }
  });

  return features;
});

// Description modal state
const showDescription = ref(false);
const modalPosition = ref({});

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
const toggleDescription = (event: Event) => {
  if (showDescription.value) {
    closeDescription();
    return;
  }

  const button = event.target as HTMLElement;
  const rect = button.getBoundingClientRect();

  modalPosition.value = {
    position: 'fixed',
    top: `${rect.bottom + 8}px`,
    left: `${rect.left - 200}px`, // Position to the left of the icon
    zIndex: 1000
  };

  showDescription.value = true;
};

const closeDescription = () => {
  showDescription.value = false;
  modalPosition.value = {};
};

// Close modal on escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && showDescription.value) {
      closeDescription();
    }
  };

  document.addEventListener('keydown', handleEscape);

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
  });
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.feature-details {
  margin-top: var(--size-16);

  &__item {
    background: var(--background-100);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    width: 300px;

    @include mq.mobile-only {
      width: 100%;
    }

    &-content {
      padding: var(--size-16);
      position: relative;

      &-type {
        text-transform: capitalize;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--size-8);
      }
    }

    &-title-wrapper {
      display: flex;
      align-items: center;
      gap: var(--size-8);
    }

    &-detail {
      display: flex;
      align-items: center;
      gap: var(--size-8);
      margin: var(--size-8) 0;
    }

    &-features {
      display: flex;
      align-items: flex-start;
      gap: var(--size-4);
      margin: var(--size-12) 0;

      .a-icon {
        flex-shrink: 0;
      }

      &-pills {
        display: flex;
        flex-wrap: wrap;
        gap: var(--size-4);
        flex: 1;

        .a-pill {
          background: var(--background-300);
          color: var(--foreground-100);
        }
      }
    }
  }

  .a-icon {
    width: 22px;
    height: 22px;
    color: var(--foreground-200);
    margin-bottom: var(--size-2);
  }
}

/* Modal styles (teleported to body) */
.feature-description-modal {
  background: var(--background-100);
  border: 1px solid var(--monochrome-600);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  max-width: 300px;
  padding: var(--size-12);
  position: relative;

  p {
    margin: 0;
    line-height: 1.4;
    padding-right: var(--size-20);
  }

  &__close {
    position: absolute;
    top: var(--size-8);
    right: var(--size-8);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--size-2);
    border-radius: var(--border-radius-sm);
    color: var(--foreground-200);

    &:hover {
      background-color: var(--background-200);
      color: var(--foreground-100);
    }
  }
}
</style>