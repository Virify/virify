<template>
  <!-- Garden details section with cards for each garden -->
  <div class="garden-details">
    <!-- Section title with garden count -->
    <h2 class="| title-sm">{{ gardenTitle }}</h2>

    <!-- List of garden cards -->
    <ul class="garden-details__list">
      <li v-for="(garden, index) in gardens" :key="index" class="garden-details__item">

        <!-- Garden image -->
        <div class="garden-details__item-image">
          <nuxt-img v-if="garden.media[0]" :src="garden.media[0].image!" :alt="garden.media[0].metadata!"
            class="| image-sm" />
        </div>

        <!-- Garden content -->
        <div class="garden-details__item-content | body-sm">

          <!-- Garden type header with icon and info button -->
          <p class="garden-details__item-content-type | font-semibold">
            <span class="garden-details__item-title-wrapper">
              <AtomsIcon :icon="getGardenIcon(garden)" :size="20" class="garden-details__type-icon" />
              {{ getGardenType(garden) }}
            </span>
            <!-- Info button to show description modal (only if description exists) -->
            <button v-if="garden.description" @click="toggleDescription(index, $event)"
              class="button button-xs button-quiet" type="button"
              :aria-label="`Show description for ${getGardenType(garden)}`">
              <AtomsIcon icon="property/info" :size="18" />
            </button>
          </p>

          <!-- Garden size (only if size exists) -->
          <p v-if="garden.size" class="garden-details__item-detail">
            <AtomsIcon icon="property/size" :size="24" class="garden-details__icon" />
            {{ garden.size }}sqmt
          </p>

          <!-- Garden features as pills (only if features exist) -->
          <div class="garden-details__item-features" v-if="getFeatures(garden).length > 0">
            <AtomsIcon icon="property/feature" :size="24" class="garden-details__icon" />
            <div class="garden-details__item-features-pills">
              <AtomsPill v-for="feature in getFeatures(garden)" :key="feature" class="| body-xs">
                {{ feature }}
              </AtomsPill>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <!-- Description modal teleported to body for proper positioning -->
  <Teleport to="body">
    <div v-if="activeDescription !== null && gardens[activeDescription]?.description" class="garden-description-modal"
      :style="modalPosition" @click.stop>
      <!-- Garden description text -->
      <p class="| body-xs">{{ gardens[activeDescription]?.description }}</p>
      <!-- Close button -->
      <button @click="closeDescription" class="garden-description-modal__close" type="button"
        aria-label="Close description">
        <AtomsIcon icon="property/close" :size="14" />
      </button>
    </div>
  </Teleport>

</template>

<script setup lang="ts">
import type { Prisma } from '~~/layers/database/server/database/prisma/generated/client';

interface Props {
  frontGarden?: Prisma.FrontGardenGetPayload<{ include: { media: true } }> | null;
  rearGarden?: Prisma.RearGardenGetPayload<{ include: { media: true } }> | null;
}

const props = defineProps<Props>();

// Computed properties
const gardens = computed(() => {
  const gardenList = [];
  if (props.frontGarden) {
    gardenList.push({ ...props.frontGarden, gardenType: 'front' });
  }
  if (props.rearGarden) {
    gardenList.push({ ...props.rearGarden, gardenType: 'rear' });
  }
  return gardenList;
});

const gardenTitle = computed(() => {
  const count = gardens.value.length;
  return count === 1 ? 'Garden (1)' : `Gardens (${count})`;
});

// Description modal state
const activeDescription = ref<number | null>(null);
const modalPosition = ref({});

// Helper functions
const getGardenIcon = (garden: any): string => {
  return getGardenTypeIcon(garden.gardenType);
};

// Description modal methods
const toggleDescription = (index: number, event: Event) => {
  if (activeDescription.value === index) {
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

  activeDescription.value = index;
};

const closeDescription = () => {
  activeDescription.value = null;
  modalPosition.value = {};
};

// Close modal on escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && activeDescription.value !== null) {
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

.garden-details {
  margin-top: var(--size-16);

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    gap: var(--size-16);
    margin: var(--size-16) 0;
    flex-wrap: wrap;

    @include mq.mobile-only {
      flex-direction: column;
      gap: var(--size-12);
    }
  }

  &__item {
    background: var(--background-100);
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--monochrome-600);
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
    width: 300px;

    @include mq.mobile-only {
      width: 100%;
    }

    &-image {
      height: auto;
      border-radius: var(--border-radius-lg);
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      overflow: hidden;
      aspect-ratio: 16 / 9;

      img {
        width: 300px;
      }

      @include mq.mobile-only {
        img {
          width: 100%;
        }
      }
    }

    &-content {
      padding: var(--size-16);

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
      align-items: flex-start;
      gap: var(--size-8);

      .a-icon {
        flex-shrink: 0;
      }
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
.garden-description-modal {
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