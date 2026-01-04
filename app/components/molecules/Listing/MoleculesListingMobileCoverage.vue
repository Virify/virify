<template>
  <div class="feature-card" @click="toggleCollapse">
    <div class="feature-card__content | body-md">
      <!-- Title row with icon, title, info button, and collapse arrow -->
      <AtomsCollapsibleHeader :is-collapsed="isCollapsed" icon="listings/signal" title="Mobile Coverage" variant="inline"
        @toggle="() => {}">
        <template #actions>
          <AtomsTooltip v-if="description" :responsive="true">
            <AtomsIcon icon="property/info" :size="16" />
            <template #tooltip>
              <p class="body-xs">{{ description }}</p>
            </template>
          </AtomsTooltip>
        </template>
      </AtomsCollapsibleHeader>

      <!-- Mobile coverage details (collapsible) -->
      <div v-show="!isCollapsed" class="feature-card__details-section">
        <ul class="mobile-coverage__list">
          <li v-for="network in networks" :key="network.name" class="feature-card__detail-row">
            <span class="feature-card__detail-label | body-sm">{{ network.name }}:</span>
            <div class="feature-card__pills">
              <AtomsPill class="body-xs">{{ network.coverage }}</AtomsPill>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface NetworkCoverage {
  name: string;
  coverage: string;
}

interface Props {
  networks?: NetworkCoverage[];
}

const props = withDefaults(defineProps<Props>(), {
  networks: () => [
    { name: 'EE', coverage: 'Excellent' },
    { name: 'O2', coverage: 'Good' },
    { name: 'Vodafone', coverage: 'Fair' },
    { name: 'Three', coverage: 'Poor' }
  ]
});

// Collapse state - open by default
const isCollapsed = ref(false);

// Collapse toggle
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const description = computed(() => {
  return "This section provides information about the mobile network coverage available at the property. It includes details on various networks and their coverage quality.";
});
</script>

<style lang="scss">
@use "#styles/_utils/media" as mq;

.mobile-coverage__list {
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